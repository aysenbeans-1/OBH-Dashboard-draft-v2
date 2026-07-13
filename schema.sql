-- ==========================================
-- OBH Dashboard Schema Initialization Setup (Plan A)
-- ==========================================

CREATE DATABASE IF NOT EXISTS obhdashboard;
USE obhdashboard;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

-- 1. Create Users Table for logins
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'customer') NOT NULL,
  tenant_id VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Companies Table (Step 1)
CREATE TABLE companies (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  modifier VARCHAR(100) NOT NULL
);

-- 3. Create Operator Connections Table (Step 2)
CREATE TABLE connections (
  id VARCHAR(36) PRIMARY KEY,
  connection_name VARCHAR(100) NOT NULL,
  operator VARCHAR(100) NOT NULL,
  protocol VARCHAR(100) NOT NULL,
  connection_url VARCHAR(255) NOT NULL,
  host_name VARCHAR(100) NOT NULL,
  port VARCHAR(50) NOT NULL,
  login_id VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  bind_type VARCHAR(50) DEFAULT '',
  sms_throughput VARCHAR(50) DEFAULT '100',
  buffer_size VARCHAR(50) DEFAULT '1000',
  timeout VARCHAR(50) DEFAULT '30',
  retry_count VARCHAR(50) DEFAULT '3',
  keep_alive_interval VARCHAR(50) DEFAULT '60',
  keep_alive_enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  dedicated_connection BOOLEAN DEFAULT FALSE,
  international_allowed BOOLEAN DEFAULT FALSE,
  round_robin_enabled BOOLEAN DEFAULT FALSE,
  mt_shortcode VARCHAR(50),
  mo_shortcode VARCHAR(50),
  modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  modifier VARCHAR(100) NOT NULL
);

-- 4. Create Tenant Configurations Table (Step 3)
CREATE TABLE tenants (
  id VARCHAR(36) PRIMARY KEY,
  cp_code VARCHAR(50) NOT NULL UNIQUE,
  company_name VARCHAR(100) NOT NULL,
  short_code VARCHAR(50) NOT NULL,
  application_id VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  mo_certificate_name VARCHAR(255) DEFAULT 'None',
  mo_access_protocol VARCHAR(100) DEFAULT '',
  ssl_enabled BOOLEAN DEFAULT FALSE,
  bounce_sms_url VARCHAR(255) DEFAULT '',
  mo_production_url VARCHAR(255) DEFAULT '',
  dlr_staging_url VARCHAR(255) DEFAULT '',
  dlr_production_url VARCHAR(255) DEFAULT '',
  mt_staging_url VARCHAR(255) DEFAULT '',
  mt_production_url1 VARCHAR(255) DEFAULT '',
  mt_production_url2 VARCHAR(255) DEFAULT '',
  cp_portal_url VARCHAR(255) DEFAULT '',
  local_routing_operator VARCHAR(100) DEFAULT '',
  international_routing_operator VARCHAR(100) DEFAULT '',
  description TEXT,
  mt_service BOOLEAN DEFAULT FALSE,
  mo_service BOOLEAN DEFAULT FALSE,
  mo_concatenation BOOLEAN DEFAULT FALSE,
  tpoa BOOLEAN DEFAULT FALSE,
  alternate_route BOOLEAN DEFAULT FALSE,
  delivery_receipt BOOLEAN DEFAULT FALSE,
  legacy_support BOOLEAN DEFAULT FALSE,
  return_delivery_receipt BOOLEAN DEFAULT FALSE,
  dedicated_service BOOLEAN DEFAULT FALSE,
  divert_ported_out_number BOOLEAN DEFAULT FALSE,
  modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  modifier VARCHAR(100) NOT NULL,
  FOREIGN KEY (company_name) REFERENCES companies(name) ON DELETE CASCADE
);

-- 5. Create User Profiles Table (User Profile Configuration)
CREATE TABLE user_profiles (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  login_id VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_name) REFERENCES companies(name) ON DELETE CASCADE
);

-- Seed Default Admins & Users
INSERT INTO users (id, username, password, role, tenant_id) VALUES
('usr-admin-01', 'admin', 'admin123', 'admin', NULL),
('usr-cust-dbs', 'dbs_user', 'dbs123', 'customer', 'dbs'),
('usr-cust-uob', 'uob_user', 'uob123', 'customer', 'uob');

-- Seed Step 1 Companies
INSERT INTO companies (id, name, type, description, modifier) VALUES
('1', 'DBS Bank', 'Content Provider', 'DBS Bank Corporation SG', 'admin'),
('2', 'UOB Bank', 'Content Provider', 'United Overseas Bank SG', 'admin'),
('3', 'Singtel', 'Content Provider', 'Singtel Mobile Operator and Service Provider', 'admin');

-- Seed Step 2 Connections
INSERT INTO connections (id, connection_name, operator, protocol, connection_url, host_name, port, login_id, password, mt_shortcode, mo_shortcode, modifier) VALUES
('1', 'M1 SMPP Main', 'M1', 'SMPP', 'smpp://smsc.m1.com.sg', 'smsc.m1.com.sg', '2775', 'm1_tenant', 'password123', '61288', '81288', 'admin'),
('2', 'SingTel HTTP Backup', 'SingTel', 'HTTP', 'https://api.singtel.com/sms', 'api.singtel.com', '443', 'singtel_user', 'secret_key_abc', '65590', '85590', 'admin');

-- Seed Step 3 Tenants
INSERT INTO tenants (id, cp_code, company_name, short_code, application_id, password, description, modifier) VALUES
('t1', 'CP-DBS-01', 'DBS Bank', '61288', 'DBS_APP_ID', 'dbs_pass', 'DBS Bank Main Transactional SMS', 'admin'),
('t2', 'CP-SGT-03', 'Singtel', '65590', 'SINGTEL_ALERT_ID', 'sing_pass', 'Singtel Network OTP Service', 'admin'),
('t3', 'CP-UOB-02', 'UOB Bank', '81288', 'UOB_OTP_ID', 'uob_pass', 'UOB Bank Primary OTP Alerts', 'admin');

-- Seed User Profiles
INSERT INTO user_profiles (id, first_name, company_name, login_id, password, email) VALUES
('p1', 'Albert Tan', 'DBS Bank', 'albert_tan', 'albert123', 'albert_tan@dbsbank.com'),
('p2', 'Beatrice Lim', 'UOB Bank', 'beatrice_lim', 'beatrice123', 'beatrice_lim@uobbank.com'),
('p3', 'Charlie Sng', 'Singtel', 'charlie_sng', 'charlie123', 'charlie_sng@singtel.com');

-- Map seeded user profiles to the users table so they can log in immediately
INSERT INTO users (id, username, password, role, tenant_id) VALUES
('usr-prof-p1', 'albert_tan', 'albert123', 'customer', 'dbs'),
('usr-prof-p2', 'beatrice_lim', 'password123', 'customer', 'uob'), -- Wait, let's keep password matching 'beatrice123'
('usr-prof-p3', 'charlie_sng', 'charlie123', 'customer', 'singtel');

-- Fix Beatrice's password to match her user profile password
UPDATE users SET password = 'beatrice123' WHERE username = 'beatrice_lim';

SELECT 'Plan A Database successfully initialized!' AS status;
