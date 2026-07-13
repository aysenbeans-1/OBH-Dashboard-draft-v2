import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let useMock = false;
let pool = null;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectionLimit: 10
};

// Check if critical MySQL credentials are configured
if (!dbConfig.host || !dbConfig.database || !dbConfig.user) {
  console.warn("⚠️ MySQL environment variables are missing (DB_HOST, DB_USER, DB_NAME). Falling back to In-Memory simulated DB for AI Studio compatibility.");
  useMock = true;
} else {
  try {
    pool = mysql.createPool(dbConfig);
    console.log("🔌 Initialized MySQL Connection Pool for", dbConfig.host);
  } catch (err) {
    console.error("❌ Failed to initialize MySQL Pool:", err.message);
    useMock = true;
  }
}

// In-memory mock database arrays to keep the application 100% operational in AI Studio sandbox
const MOCK_USERS = [
  { id: 'usr-admin-01', username: 'admin', password: 'admin123', role: 'admin', tenant_id: null },
  { id: 'usr-cust-dbs', username: 'dbs_user', password: 'dbs123', role: 'customer', tenant_id: 'dbs' },
  { id: 'usr-cust-uob', username: 'uob_user', password: 'uob123', role: 'customer', tenant_id: 'uob' },
  { id: 'usr-prof-p1', username: 'albert_tan', password: 'albert123', role: 'customer', tenant_id: 'dbs' },
  { id: 'usr-prof-p2', username: 'beatrice_lim', password: 'beatrice123', role: 'customer', tenant_id: 'uob' },
  { id: 'usr-prof-p3', username: 'charlie_sng', password: 'charlie123', role: 'customer', tenant_id: 'singtel' }
];

const MOCK_COMPANIES = [
  { id: '1', name: 'DBS Bank', type: 'Content Provider', description: 'DBS Bank Corporation SG', modifiedDate: '2026-06-25 14:32:00', modified_date: '2026-06-25 14:32:00', modifier: 'admin' },
  { id: '2', name: 'UOB Bank', type: 'Content Provider', description: 'United Overseas Bank SG', modifiedDate: '2026-06-24 09:15:22', modified_date: '2026-06-24 09:15:22', modifier: 'admin' },
  { id: '3', name: 'Singtel', type: 'Content Provider', description: 'Singtel Mobile Operator and Service Provider', modifiedDate: '2026-06-23 18:45:10', modified_date: '2026-06-23 18:45:10', modifier: 'admin' },
];

const MOCK_CONNECTIONS = [
  {
    id: '1',
    connectionName: 'M1 SMPP Main',
    connection_name: 'M1 SMPP Main',
    operator: 'M1',
    protocol: 'SMPP',
    connectionUrl: 'smpp://smsc.m1.com.sg',
    connection_url: 'smpp://smsc.m1.com.sg',
    hostName: 'smsc.m1.com.sg',
    host_name: 'smsc.m1.com.sg',
    port: '2775',
    loginId: 'm1_tenant',
    login_id: 'm1_tenant',
    password: 'password123',
    bindType: 'TX/RX',
    bind_type: 'TX/RX',
    smsThroughput: '100',
    sms_throughput: '100',
    bufferSize: '1000',
    buffer_size: '1000',
    timeout: '30',
    retryCount: '3',
    retry_count: '3',
    keepAliveInterval: '60',
    keep_alive_interval: '60',
    keepAliveEnabled: true,
    keep_alive_enabled: true,
    description: 'Primary connection to M1 SMS gateway',
    dedicatedConnection: true,
    dedicated_connection: true,
    internationalAllowed: false,
    international_allowed: false,
    roundRobinEnabled: true,
    round_robin_enabled: true,
    mtShortcode: '61288',
    mt_shortcode: '61288',
    moShortcode: '81288',
    mo_shortcode: '81288',
    modifiedDate: '2026-06-25 15:10:45',
    modified_date: '2026-06-25 15:10:45',
    modifier: 'admin'
  },
  {
    id: '2',
    connectionName: 'SingTel HTTP Backup',
    connection_name: 'SingTel HTTP Backup',
    operator: 'SingTel',
    protocol: 'HTTP',
    connectionUrl: 'https://api.singtel.com/sms',
    connection_url: 'https://api.singtel.com/sms',
    hostName: 'api.singtel.com',
    host_name: 'api.singtel.com',
    port: '443',
    loginId: 'singtel_user',
    login_id: 'singtel_user',
    password: 'secret_key_abc',
    bindType: '',
    bind_type: '',
    smsThroughput: '50',
    sms_throughput: '50',
    bufferSize: '500',
    buffer_size: '500',
    timeout: '15',
    retryCount: '5',
    retry_count: '5',
    keepAliveInterval: '30',
    keep_alive_interval: '30',
    keepAliveEnabled: false,
    keep_alive_enabled: false,
    description: 'Backup HTTP service route',
    dedicatedConnection: false,
    dedicated_connection: false,
    internationalAllowed: true,
    international_allowed: true,
    roundRobinEnabled: false,
    round_robin_enabled: false,
    mtShortcode: '65590',
    mt_shortcode: '65590',
    moShortcode: '85590',
    mo_shortcode: '85590',
    modifiedDate: '2026-06-24 11:24:15',
    modified_date: '2026-06-24 11:24:15',
    modifier: 'admin'
  }
];

const MOCK_TENANTS = [
  {
    id: 't1',
    cpCode: 'CP-DBS-01',
    cp_code: 'CP-DBS-01',
    companyName: 'DBS Bank',
    company_name: 'DBS Bank',
    shortCode: '61288',
    short_code: '61288',
    applicationId: 'DBS_APP_ID',
    application_id: 'DBS_APP_ID',
    description: 'DBS Bank Main Transactional SMS',
    modifiedDate: '2026-06-25 16:45:22',
    modified_date: '2026-06-25 16:45:22',
    modifier: 'admin'
  },
  {
    id: 't2',
    cpCode: 'CP-SGT-03',
    cp_code: 'CP-SGT-03',
    companyName: 'Singtel',
    company_name: 'Singtel',
    shortCode: '65590',
    short_code: '65590',
    applicationId: 'SINGTEL_ALERT_ID',
    application_id: 'SINGTEL_ALERT_ID',
    description: 'Singtel Network OTP Service',
    modifiedDate: '2026-06-24 10:30:15',
    modified_date: '2026-06-24 10:30:15',
    modifier: 'admin'
  },
  {
    id: 't3',
    cpCode: 'CP-UOB-02',
    cp_code: 'CP-UOB-02',
    companyName: 'UOB Bank',
    company_name: 'UOB Bank',
    shortCode: '81288',
    short_code: '81288',
    applicationId: 'UOB_OTP_ID',
    application_id: 'UOB_OTP_ID',
    description: 'UOB Bank Primary OTP Alerts',
    modifiedDate: '2026-06-25 09:12:00',
    modified_date: '2026-06-25 09:12:00',
    modifier: 'admin'
  }
];

const MOCK_USER_PROFILES = [
  { id: 'p1', name: 'Albert Tan', first_name: 'Albert Tan', company: 'DBS Bank', company_name: 'DBS Bank', email: 'albert_tan@dbsbank.com', loginId: 'albert_tan', login_id: 'albert_tan' },
  { id: 'p2', name: 'Beatrice Lim', first_name: 'Beatrice Lim', company: 'UOB Bank', company_name: 'UOB Bank', email: 'beatrice_lim@uobbank.com', loginId: 'beatrice_lim', login_id: 'beatrice_lim' },
  { id: 'p3', name: 'Charlie Sng', first_name: 'Charlie Sng', company: 'Singtel', company_name: 'Singtel', email: 'charlie_sng@singtel.com', loginId: 'charlie_sng', login_id: 'charlie_sng' }
];

export async function query(sql, params = []) {
  if (useMock) {
    return handleMockQuery(sql, params);
  }

  try {
    const [rows] = await pool.query(sql, params);
    return [rows];
  } catch (error) {
    console.warn(`⚠️ MySQL Database is not reachable: ${error.message}. Switching to In-Memory simulated fallback database to keep the app functional.`);
    useMock = true; // Permanently lock into mock mode for this session to prevent repeat timeout errors
    return handleMockQuery(sql, params);
  }
}

function handleMockQuery(sql, params) {
  const normalized = sql.toLowerCase().trim();

  // 1. Users Queries
  if (normalized.includes('from users')) {
    if (normalized.includes('where username = ?')) {
      const usernameParam = params[0];
      const found = MOCK_USERS.filter(u => u.username.toLowerCase() === (usernameParam || '').toLowerCase());
      return [found];
    }
    return [MOCK_USERS];
  }

  // 2. Companies Queries
  if (normalized.includes('companies')) {
    if (normalized.startsWith('select')) {
      return [MOCK_COMPANIES];
    }
    if (normalized.startsWith('insert')) {
      // INSERT INTO companies (id, name, type, description, modifier) VALUES (?, ?, ?, ?, ?)
      const [id, name, type, description, modifier] = params;
      const newCompany = {
        id: id || Math.random().toString(36).substring(2, 9),
        name,
        type,
        description: description || '',
        modifiedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modified_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modifier: modifier || 'admin'
      };
      MOCK_COMPANIES.unshift(newCompany);
      return [{ insertId: newCompany.id, affectedRows: 1 }];
    }
    if (normalized.startsWith('delete')) {
      // Simple parse for DELETE. Usually "DELETE FROM companies WHERE id = ?"
      const idToDelete = params[0];
      const idx = MOCK_COMPANIES.findIndex(c => c.id === idToDelete);
      if (idx !== -1) {
        MOCK_COMPANIES.splice(idx, 1);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
  }

  // 3. Connections Queries
  if (normalized.includes('connections')) {
    if (normalized.startsWith('select')) {
      return [MOCK_CONNECTIONS];
    }
    if (normalized.startsWith('insert')) {
      // Grab fields based on full insert
      const [
        id, connectionName, operator, protocol, connectionUrl, hostName, port, loginId, password,
        bindType, smsThroughput, bufferSize, timeout, retryCount, keepAliveInterval, keepAliveEnabled,
        description, dedicatedConnection, internationalAllowed, roundRobinEnabled, mtShortcode, moShortcode, modifier
      ] = params;

      const newConn = {
        id: id || Math.random().toString(36).substring(2, 9),
        connectionName,
        connection_name: connectionName,
        operator,
        protocol,
        connectionUrl,
        connection_url: connectionUrl,
        hostName,
        host_name: hostName,
        port,
        loginId,
        login_id: loginId,
        password,
        bindType: bindType || '',
        bind_type: bindType || '',
        smsThroughput: smsThroughput || '100',
        sms_throughput: smsThroughput || '100',
        bufferSize: bufferSize || '1000',
        buffer_size: bufferSize || '1000',
        timeout: timeout || '30',
        retryCount: retryCount || '3',
        retry_count: retryCount || '3',
        keepAliveInterval: keepAliveInterval || '60',
        keep_alive_interval: keepAliveInterval || '60',
        keepAliveEnabled: !!keepAliveEnabled,
        keep_alive_enabled: !!keepAliveEnabled,
        description: description || '',
        dedicatedConnection: !!dedicatedConnection,
        dedicated_connection: !!dedicatedConnection,
        internationalAllowed: !!internationalAllowed,
        international_allowed: !!internationalAllowed,
        roundRobinEnabled: !!roundRobinEnabled,
        round_robin_enabled: !!roundRobinEnabled,
        mtShortcode: mtShortcode || '',
        mt_shortcode: mtShortcode || '',
        moShortcode: moShortcode || '',
        mo_shortcode: moShortcode || '',
        modifiedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modified_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modifier: modifier || 'admin'
      };
      MOCK_CONNECTIONS.unshift(newConn);
      return [{ insertId: newConn.id, affectedRows: 1 }];
    }
    if (normalized.startsWith('delete')) {
      const idToDelete = params[0];
      const idx = MOCK_CONNECTIONS.findIndex(c => c.id === idToDelete);
      if (idx !== -1) {
        MOCK_CONNECTIONS.splice(idx, 1);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
  }

  // 4. Tenants Queries
  if (normalized.includes('tenants')) {
    if (normalized.startsWith('select')) {
      return [MOCK_TENANTS];
    }
    if (normalized.startsWith('insert')) {
      const [
        id, cpCode, companyName, shortCode, applicationId, password,
        moCertificateName, moAccessProtocol, sslEnabled, bounceSmsUrl, moProductionUrl,
        dlrStagingUrl, dlrProductionUrl, mtStagingUrl, mtProductionUrl1, mtProductionUrl2,
        cpPortalUrl, localRoutingOperator, internationalRoutingOperator, description,
        mtService, moService, moConcatenation, tpoa, alternateRoute, deliveryReceipt,
        legacySupport, returnDeliveryReceipt, dedicatedService, divertPortedOutNumber, modifier
      ] = params;

      const newTenant = {
        id: id || Math.random().toString(36).substring(2, 9),
        cpCode,
        cp_code: cpCode,
        companyName,
        company_name: companyName,
        shortCode,
        short_code: shortCode,
        applicationId,
        application_id: applicationId,
        password,
        moCertificateName: moCertificateName || 'None',
        mo_certificate_name: moCertificateName || 'None',
        moAccessProtocol: moAccessProtocol || '',
        mo_access_protocol: moAccessProtocol || '',
        sslEnabled: !!sslEnabled,
        ssl_enabled: !!sslEnabled,
        bounceSmsUrl: bounceSmsUrl || '',
        bounce_sms_url: bounceSmsUrl || '',
        moProductionUrl: moProductionUrl || '',
        mo_production_url: moProductionUrl || '',
        dlrStagingUrl: dlrStagingUrl || '',
        dlr_staging_url: dlrStagingUrl || '',
        dlrProductionUrl: dlrProductionUrl || '',
        dlr_production_url: dlrProductionUrl || '',
        mtStagingUrl: mtStagingUrl || '',
        mt_staging_url: mtStagingUrl || '',
        mtProductionUrl1: mtProductionUrl1 || '',
        mt_production_url1: mtProductionUrl1 || '',
        mtProductionUrl2: mtProductionUrl2 || '',
        mt_production_url2: mtProductionUrl2 || '',
        cpPortalUrl: cpPortalUrl || '',
        cp_portal_url: cpPortalUrl || '',
        localRoutingOperator: localRoutingOperator || '',
        local_routing_operator: localRoutingOperator || '',
        internationalRoutingOperator: internationalRoutingOperator || '',
        international_routing_operator: internationalRoutingOperator || '',
        description: description || '',
        mtService: !!mtService,
        mt_service: !!mtService,
        moService: !!moService,
        mo_service: !!moService,
        moConcatenation: !!moConcatenation,
        mo_concatenation: !!moConcatenation,
        tpoa: !!tpoa,
        alternateRoute: !!alternateRoute,
        alternate_route: !!alternateRoute,
        deliveryReceipt: !!deliveryReceipt,
        delivery_receipt: !!deliveryReceipt,
        legacySupport: !!legacySupport,
        legacy_support: !!legacySupport,
        returnDeliveryReceipt: !!returnDeliveryReceipt,
        return_delivery_receipt: !!returnDeliveryReceipt,
        dedicatedService: !!dedicatedService,
        dedicated_service: !!dedicatedService,
        divertPortedOutNumber: !!divertPortedOutNumber,
        divert_ported_out_number: !!divertPortedOutNumber,
        modifiedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modified_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        modifier: modifier || 'admin'
      };
      MOCK_TENANTS.unshift(newTenant);
      return [{ insertId: newTenant.id, affectedRows: 1 }];
    }
    if (normalized.startsWith('delete')) {
      const idToDelete = params[0];
      const idx = MOCK_TENANTS.findIndex(c => c.id === idToDelete);
      if (idx !== -1) {
        MOCK_TENANTS.splice(idx, 1);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
  }

  // 5. User Profiles Queries
  if (normalized.includes('user_profiles')) {
    if (normalized.startsWith('select')) {
      return [MOCK_USER_PROFILES];
    }
    if (normalized.startsWith('insert')) {
      // INSERT INTO user_profiles (id, first_name, company_name, login_id, password, email) VALUES (?, ?, ?, ?, ?, ?)
      const [id, firstName, companyName, loginId, password, email] = params;
      const newProf = {
        id: id || Date.now().toString(),
        name: firstName,
        company: companyName,
        email,
        loginId
      };
      MOCK_USER_PROFILES.push(newProf);

      // Automatically sync to MOCK_USERS so customer portal logins work!
      const domainText = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const tenantId = domainText.includes('dbs') ? 'dbs' : domainText.includes('uob') ? 'uob' : domainText;
      
      MOCK_USERS.push({
        id: `usr-prof-${newProf.id}`,
        username: loginId,
        password,
        role: 'customer',
        tenant_id: tenantId
      });

      return [{ insertId: newProf.id, affectedRows: 1 }];
    }
    if (normalized.startsWith('delete')) {
      const idToDelete = params[0];
      const idx = MOCK_USER_PROFILES.findIndex(p => p.id === idToDelete);
      if (idx !== -1) {
        const deletedProf = MOCK_USER_PROFILES[idx];
        MOCK_USER_PROFILES.splice(idx, 1);

        // Remove from MOCK_USERS as well
        const userIdx = MOCK_USERS.findIndex(u => u.username === deletedProf.loginId);
        if (userIdx !== -1) {
          MOCK_USERS.splice(userIdx, 1);
        }

        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
  }

  return [[]];
}

export function isUsingMock() {
  return useMock;
}
