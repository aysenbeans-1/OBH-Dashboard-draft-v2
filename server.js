import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { query, isUsingMock } from './db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'obh_dashboard_jwt_secret_key_2026';
const SESSION_DURATION_MS = 15 * 60 * 1000; // 15 minutes inactivity limit

function formatDateForDb(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function generateJwtToken(user, sessionId) {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      role: user.role, 
      tenantId: user.tenantId,
      sessionId 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}

// Core session validator + rolling extend helper
async function validateAndExtendSession(token) {
  if (!token) {
    return { valid: false, code: 'MISSING_TOKEN', message: 'Authentication token is required.' };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return { valid: false, code: 'TOKEN_EXPIRED', message: 'Session expired due to 15 minutes of inactivity.' };
    }
    return { valid: false, code: 'INVALID_TOKEN', message: 'Invalid authentication token.' };
  }

  // Check database / session storage for active session record (Layer 2)
  const [sessions] = await query('SELECT * FROM user_sessions WHERE token = ? AND is_active = 1', [token]);
  
  if (!sessions || sessions.length === 0) {
    return { 
      valid: false, 
      code: 'SESSION_INVALIDATED', 
      message: 'Your session was invalidated because a new login was initiated from another device or location.' 
    };
  }

  const session = sessions[0];
  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  if (now > expiresAt) {
    await query('UPDATE user_sessions SET is_active = 0 WHERE token = ?', [token]);
    return { valid: false, code: 'SESSION_EXPIRED', message: 'Session timed out after 15 minutes of inactivity.' };
  }

  // Extend rolling window by 15 mins (Layer 3)
  const newExpiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
  const formattedNewExpires = formatDateForDb(newExpiresAt);

  const user = {
    id: decoded.userId,
    username: decoded.username,
    role: decoded.role,
    tenantId: decoded.tenantId
  };

  const newToken = generateJwtToken(user, session.id);

  // Update session record in DB
  await query(
    'UPDATE user_sessions SET last_activity_at = CURRENT_TIMESTAMP, expires_at = ?, token = ? WHERE id = ?',
    [formattedNewExpires, newToken, session.id]
  );

  return {
    valid: true,
    user,
    sessionId: session.id,
    newToken
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to automatically validate & extend sessions for protected API calls
  const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const sessionCheck = await validateAndExtendSession(token);
    if (!sessionCheck.valid) {
      return res.status(401).json({
        success: false,
        code: sessionCheck.code,
        message: sessionCheck.message
      });
    }

    req.user = sessionCheck.user;
    req.sessionId = sessionCheck.sessionId;
    req.newToken = sessionCheck.newToken;
    
    // Pass updated token back in response header for client auto-refresh
    res.setHeader('X-Refreshed-Token', sessionCheck.newToken);
    next();
  };

  // ==========================================
  // API Endpoints
  // ==========================================

  // Authentication validation endpoint (uses DB/fallback)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password, role, tenantId } = req.body;

      if (!username || !password || !role) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required credentials (username, password, role).' 
        });
      }

      // Query core database for user details
      const [users] = await query('SELECT * FROM users WHERE username = ?', [username]);

      if (!users || users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials: User identity not found.' 
        });
      }

      const matchUser = users[0];

      // Password checks
      if (matchUser.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials: Secure password mismatch.' 
        });
      }

      // Role checks
      if (matchUser.role !== role) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Registered role is ${matchUser.role.toUpperCase()} (selected: ${role.toUpperCase()}).` 
        });
      }

      // Tenant isolation checks for regular customers
      if (role === 'customer' && tenantId) {
        const checkTenant = tenantId.toLowerCase().trim();
        const userTenant = (matchUser.tenant_id || '').toLowerCase().trim();
        
        if (userTenant !== checkTenant && !userTenant.includes(checkTenant) && !checkTenant.includes(userTenant)) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied. The specified Tenant ID does not lock onto this authenticated user context.' 
          });
        }
      }

      const authObject = {
        id: matchUser.id,
        username: matchUser.username,
        role: matchUser.role,
        tenantId: matchUser.tenant_id || undefined
      };

      // --- Layer 2: Clear/Invalidate existing active sessions for this user before issuing new one ---
      await query('UPDATE user_sessions SET is_active = 0 WHERE username = ? AND is_active = 1', [matchUser.username]);

      // --- Layer 3: Generate JWT token & record new active session ---
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const token = generateJwtToken(authObject, sessionId);
      const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
      const formattedExpires = formatDateForDb(expiresAt);

      await query(
        'INSERT INTO user_sessions (id, user_id, username, token, expires_at, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [sessionId, matchUser.id, matchUser.username, token, formattedExpires]
      );

      return res.json({
        success: true,
        user: authObject,
        token,
        expiresAt: expiresAt.toISOString(),
        dbType: isUsingMock() ? 'Simulator fallback' : 'Real Database'
      });

    } catch (err) {
      console.error('Core Login Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal Gateway auth flow failed.' 
      });
    }
  });

  // Verify / Heartbeat endpoint for active session check & rolling token refresh
  app.post('/api/auth/verify', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.body && req.body.token);

      const sessionCheck = await validateAndExtendSession(token);
      if (!sessionCheck.valid) {
        return res.status(401).json({
          success: false,
          code: sessionCheck.code,
          message: sessionCheck.message
        });
      }

      return res.json({
        success: true,
        user: sessionCheck.user,
        refreshedToken: sessionCheck.newToken
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Explicit Logout endpoint (invalidates session in database)
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.body && req.body.token);

      if (token) {
        await query('UPDATE user_sessions SET is_active = 0 WHERE token = ?', [token]);
      }

      return res.json({ success: true, message: 'Logged out and session invalidated.' });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // DB diagnostic status check
  app.get('/api/db/status', (req, res) => {
    res.json({
      connected: !isUsingMock(),
      mode: isUsingMock() ? 'In-Memory Simulation' : 'Active MySQL pool connections'
    });
  });

  // ------------------------------------------
  // Step 1: Companies Endpoints
  // ------------------------------------------
  app.get('/api/companies', async (req, res) => {
    try {
      const [companies] = await query('SELECT * FROM companies');
      res.json({ success: true, data: companies });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/companies', async (req, res) => {
    try {
      const { id, name, type, description, modifier } = req.body;
      if (!name || !type) {
        return res.status(400).json({ success: false, message: 'Missing name or type' });
      }
      const finalId = id || Math.random().toString(36).substring(2, 9);
      await query(
        'INSERT INTO companies (id, name, type, description, modifier) VALUES (?, ?, ?, ?, ?)',
        [finalId, name, type, description || '', modifier || 'admin']
      );
      res.json({ success: true, message: 'Company created successfully', id: finalId });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/companies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await query('DELETE FROM companies WHERE id = ?', [id]);
      res.json({ success: true, message: 'Company deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ------------------------------------------
  // Step 2: Connections Endpoints
  // ------------------------------------------
  app.get('/api/connections', async (req, res) => {
    try {
      const [connections] = await query('SELECT * FROM connections');
      res.json({ success: true, data: connections });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/connections', async (req, res) => {
    try {
      const conn = req.body;
      const finalId = conn.id || Math.random().toString(36).substring(2, 9);
      await query(
        `INSERT INTO connections (
          id, connection_name, operator, protocol, connection_url, host_name, port, login_id, password,
          bind_type, sms_throughput, buffer_size, timeout, retry_count, keep_alive_interval, keep_alive_enabled,
          description, dedicated_connection, international_allowed, round_robin_enabled, mt_shortcode, mo_shortcode, modifier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalId, conn.connectionName, conn.operator, conn.protocol, conn.connectionUrl, conn.hostName, conn.port, conn.loginId, conn.password,
          conn.bindType || '', conn.smsThroughput || '100', conn.bufferSize || '1000', conn.timeout || '30', conn.retryCount || '3', conn.keepAliveInterval || '60',
          !!conn.keepAliveEnabled, conn.description || '', !!conn.dedicatedConnection, !!conn.internationalAllowed, !!conn.roundRobinEnabled,
          conn.mtShortcode || '', conn.moShortcode || '', conn.modifier || 'admin'
        ]
      );
      res.json({ success: true, message: 'Connection created successfully', id: finalId });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/connections/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await query('DELETE FROM connections WHERE id = ?', [id]);
      res.json({ success: true, message: 'Connection deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ------------------------------------------
  // Step 3: Tenants Endpoints
  // ------------------------------------------
  app.get('/api/tenants', async (req, res) => {
    try {
      const [tenants] = await query('SELECT * FROM tenants');
      res.json({ success: true, data: tenants });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/tenants', async (req, res) => {
    try {
      const t = req.body;
      const finalId = t.id || Math.random().toString(36).substring(2, 9);
      await query(
        `INSERT INTO tenants (
          id, cp_code, company_name, short_code, application_id, password,
          mo_certificate_name, mo_access_protocol, ssl_enabled, bounce_sms_url, mo_production_url,
          dlr_staging_url, dlr_production_url, mt_staging_url, mt_production_url1, mt_production_url2,
          cp_portal_url, local_routing_operator, international_routing_operator, description,
          mt_service, mo_service, mo_concatenation, tpoa, alternate_route, delivery_receipt,
          legacy_support, return_delivery_receipt, dedicated_service, divert_ported_out_number, modifier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalId, t.cpCode, t.companyName, t.shortCode, t.applicationId, t.password,
          t.moCertificateName || 'None', t.moAccessProtocol || '', !!t.sslEnabled, t.bounceSmsUrl || '', t.moProductionUrl || '',
          t.dlrStagingUrl || '', t.dlrProductionUrl || '', t.mtStagingUrl || '', t.mtProductionUrl1 || '', t.mtProductionUrl2 || '',
          t.cpPortalUrl || '', t.localRoutingOperator || '', t.internationalRoutingOperator || '', t.description || '',
          !!t.mtService, !!t.moService, !!t.moConcatenation, !!t.tpoa, !!t.alternateRoute, !!t.deliveryReceipt,
          !!t.legacySupport, !!t.returnDeliveryReceipt, !!t.dedicatedService, !!t.divertPortedOutNumber, t.modifier || 'admin'
        ]
      );
      res.json({ success: true, message: 'Tenant configuration created successfully', id: finalId });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/tenants/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await query('DELETE FROM tenants WHERE id = ?', [id]);
      res.json({ success: true, message: 'Tenant configuration deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ------------------------------------------
  // User Profiles Endpoints
  // ------------------------------------------
  app.get('/api/user-profiles', async (req, res) => {
    try {
      const [profiles] = await query('SELECT * FROM user_profiles');
      res.json({ success: true, data: profiles });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/user-profiles', async (req, res) => {
    try {
      const { id, firstName, companyName, loginId, password, email } = req.body;
      if (!firstName || !companyName || !loginId || !password) {
        return res.status(400).json({ success: false, message: 'Missing required user profile fields' });
      }
      const finalId = id || Date.now().toString();

      // Insert into user_profiles
      await query(
        'INSERT INTO user_profiles (id, first_name, company_name, login_id, password, email) VALUES (?, ?, ?, ?, ?, ?)',
        [finalId, firstName, companyName, loginId, password, email || '']
      );

      // Map/Sync to users table for real database
      const domainText = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const tenantId = domainText.includes('dbs') ? 'dbs' : domainText.includes('uob') ? 'uob' : domainText;

      // Ensure no duplicate usernames in the users table
      const [existingUsers] = await query('SELECT id FROM users WHERE username = ?', [loginId]);
      if (!existingUsers || existingUsers.length === 0) {
        await query(
          'INSERT INTO users (id, username, password, role, tenant_id) VALUES (?, ?, ?, ?, ?)',
          [`usr-prof-${finalId}`, loginId, password, 'customer', tenantId]
        );
      }

      res.json({ success: true, message: 'User profile created and login mapped successfully', id: finalId });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.delete('/api/user-profiles/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // Get profile login_id first to clean up matching user login
      const [profiles] = await query('SELECT login_id FROM user_profiles WHERE id = ?', [id]);
      if (profiles && profiles.length > 0) {
        const loginId = profiles[0].login_id;
        await query('DELETE FROM users WHERE username = ?', [loginId]);
      }

      await query('DELETE FROM user_profiles WHERE id = ?', [id]);
      res.json({ success: true, message: 'User profile deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ==========================================
  // Vite Integration Setup
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Back-End Express and Vite dev server listening at http://localhost:${PORT}`);
  });
}

startServer();
