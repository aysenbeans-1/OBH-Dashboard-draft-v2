import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { query, isUsingMock } from './db.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

      // Password checks (direct comparisons consistent with initial schema values)
      if (matchUser.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials: Secure password mismatch.' 
        });
      }

      // Role checks (prevents cross-role elevation)
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
        
        // Match base name or substring to allow flexible matches like "dbsbank" -> "dbs"
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

      return res.json({
        success: true,
        user: authObject,
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
          id, cp_code, company_name, short_code, applicationId, password,
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
