import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShieldCheck, Building, HelpCircle, Save, X, Upload, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

export function ManageTenant({ user }) {
  const [activeStep, setActiveStep] = useState('step1');

  // Sync data with Back-end API database on mount
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const resComp = await fetch('/api/companies');
        const dataComp = await resComp.json();
        if (dataComp.success && dataComp.data) {
          const norm = dataComp.data.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            description: c.description || '',
            modifiedDate: c.modified_date ? c.modified_date.replace('T', ' ').substring(0, 19) : c.modifiedDate,
            modifier: c.modifier
          }));
          setCompanies(norm);
        }
      } catch (err) {
        console.warn('Backend API /api/companies offline or not loaded:', err);
      }

      try {
        const resConn = await fetch('/api/connections');
        const dataConn = await resConn.json();
        if (dataConn.success && dataConn.data) {
          const norm = dataConn.data.map(c => ({
            id: c.id,
            connectionName: c.connection_name !== undefined ? c.connection_name : c.connectionName,
            operator: c.operator,
            protocol: c.protocol,
            connectionUrl: c.connection_url !== undefined ? c.connection_url : c.connectionUrl,
            hostName: c.host_name !== undefined ? c.host_name : c.hostName,
            port: c.port,
            loginId: c.login_id !== undefined ? c.login_id : c.loginId,
            password: c.password,
            bindType: c.bind_type !== undefined ? c.bind_type : (c.bindType || ''),
            smsThroughput: c.sms_throughput !== undefined ? c.sms_throughput : (c.smsThroughput || '100'),
            bufferSize: c.buffer_size !== undefined ? c.buffer_size : (c.bufferSize || '1000'),
            timeout: c.timeout !== undefined ? c.timeout : (c.timeout || '30'),
            retryCount: c.retry_count !== undefined ? c.retry_count : (c.retryCount || '3'),
            keepAliveInterval: c.keep_alive_interval !== undefined ? c.keep_alive_interval : (c.keepAliveInterval || '60'),
            keepAliveEnabled: c.keep_alive_enabled !== undefined ? !!c.keep_alive_enabled : !!c.keepAliveEnabled,
            description: c.description || '',
            dedicatedConnection: c.dedicated_connection !== undefined ? !!c.dedicated_connection : !!c.dedicatedConnection,
            internationalAllowed: c.international_allowed !== undefined ? !!c.international_allowed : !!c.internationalAllowed,
            roundRobinEnabled: c.round_robin_enabled !== undefined ? !!c.round_robin_enabled : !!c.roundRobinEnabled,
            mtShortcode: c.mt_shortcode !== undefined ? c.mt_shortcode : (c.mtShortcode || ''),
            moShortcode: c.mo_shortcode !== undefined ? c.mo_shortcode : (c.moShortcode || ''),
            modifiedDate: c.modified_date ? c.modified_date.replace('T', ' ').substring(0, 19) : c.modifiedDate,
            modifier: c.modifier
          }));
          setConnections(norm);
        }
      } catch (err) {
        console.warn('Backend API /api/connections offline or not loaded:', err);
      }

      try {
        const resTenant = await fetch('/api/tenants');
        const dataTenant = await resTenant.json();
        if (dataTenant.success && dataTenant.data) {
          const norm = dataTenant.data.map(t => ({
            id: t.id,
            cpCode: t.cp_code !== undefined ? t.cp_code : t.cpCode,
            companyName: t.company_name !== undefined ? t.company_name : t.companyName,
            shortCode: t.short_code !== undefined ? t.short_code : t.shortCode,
            applicationId: t.application_id !== undefined ? t.application_id : (t.applicationId || ''),
            password: t.password,
            moCertificateName: t.mo_certificate_name !== undefined ? t.mo_certificate_name : (t.moCertificateName || 'None'),
            moAccessProtocol: t.mo_access_protocol !== undefined ? t.mo_access_protocol : (t.moAccessProtocol || ''),
            sslEnabled: t.ssl_enabled !== undefined ? !!t.ssl_enabled : !!t.sslEnabled,
            bounceSmsUrl: t.bounce_sms_url !== undefined ? t.bounce_sms_url : (t.bounceSmsUrl || ''),
            moProductionUrl: t.mo_production_url !== undefined ? t.mo_production_url : (t.moProductionUrl || ''),
            dlrStagingUrl: t.dlr_staging_url !== undefined ? t.dlr_staging_url : (t.dlrStagingUrl || ''),
            dlrProductionUrl: t.dlr_production_url !== undefined ? t.dlr_production_url : (t.dlrProductionUrl || ''),
            mtStagingUrl: t.mt_staging_url !== undefined ? t.mt_staging_url : (t.mtStagingUrl || ''),
            mtProductionUrl1: t.mt_production_url1 !== undefined ? t.mt_production_url1 : (t.mtProductionUrl1 || ''),
            mtProductionUrl2: t.mt_production_url2 !== undefined ? t.mt_production_url2 : (t.mtProductionUrl2 || ''),
            cpPortalUrl: t.cp_portal_url !== undefined ? t.cp_portal_url : (t.cpPortalUrl || ''),
            localRoutingOperator: t.local_routing_operator !== undefined ? t.local_routing_operator : (t.localRoutingOperator || ''),
            internationalRoutingOperator: t.international_routing_operator !== undefined ? t.international_routing_operator : (t.internationalRoutingOperator || ''),
            description: t.description || 'None',
            mtService: t.mt_service !== undefined ? !!t.mt_service : !!t.mtService,
            moService: t.mo_service !== undefined ? !!t.mo_service : !!t.moService,
            moConcatenation: t.mo_concatenation !== undefined ? !!t.mo_concatenation : !!t.moConcatenation,
            tpoa: t.tpoa !== undefined ? !!t.tpoa : !!t.tpoa,
            alternateRoute: t.alternate_route !== undefined ? !!t.alternate_route : !!t.alternateRoute,
            deliveryReceipt: t.delivery_receipt !== undefined ? !!t.delivery_receipt : !!t.deliveryReceipt,
            legacySupport: t.legacy_support !== undefined ? !!t.legacy_support : !!t.legacySupport,
            returnDeliveryReceipt: t.return_delivery_receipt !== undefined ? !!t.return_delivery_receipt : !!t.returnDeliveryReceipt,
            dedicatedService: t.dedicated_service !== undefined ? !!t.dedicated_service : !!t.dedicatedService,
            divertPortedOutNumber: t.divert_ported_out_number !== undefined ? !!t.divert_ported_out_number : !!t.divertPortedOutNumber,
            modifiedDate: t.modified_date ? t.modified_date.replace('T', ' ').substring(0, 19) : t.modifiedDate,
            modifier: t.modifier
          }));
          setTenants(norm);
        }
      } catch (err) {
        console.warn('Backend API /api/tenants offline or not loaded:', err);
      }
    };
    syncWithBackend();
  }, []);

  const ensureTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    if (trimmed.length <= 10) {
      return `${trimmed} 12:00:00`;
    }
    return trimmed;
  };
  
  // ==========================================
  // STEP 1 STATES & LOGIC (Company Profile)
  // ==========================================
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  // Company state with localStorage persistence and proper timestamps
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('tenant_companies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: '1', name: 'DBS Bank', type: 'Content Provider', modifiedDate: '2026-06-25 14:32:00', modifier: 'admin' },
      { id: '2', name: 'UOB Bank', type: 'Content Provider', modifiedDate: '2026-06-24 09:15:22', modifier: 'admin' },
      { id: '3', name: 'Singtel', type: 'Content Provider', modifiedDate: '2026-06-23 18:45:10', modifier: 'admin' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('tenant_companies', JSON.stringify(companies));
  }, [companies]);

  // Step 1 Form states
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const companyTypeConstant = 'Content Provider';

  // Step 1 Search / Filter states
  const [searchCompanyName, setSearchCompanyName] = useState('');
  const [searchCompanyType, setSearchCompanyType] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [isSearched, setIsSearched] = useState(false);

  // Sync filtered view with raw companies list
  useEffect(() => {
    if (!isSearched) {
      setFilteredCompanies(companies);
    } else {
      applySearch();
    }
  }, [companies, isSearched]);

  // Checkbox state for Step 1
  const [selectedIds, setSelectedIds] = useState([]);

  // Check if both Step 1 filter values are null / empty
  const isSearchDisabled = !searchCompanyName.trim() && !searchCompanyType;

  const applySearch = () => {
    if (isSearchDisabled) return;
    
    const result = companies.filter(company => {
      const matchesName = searchCompanyName.trim() 
        ? company.name.toLowerCase().includes(searchCompanyName.trim().toLowerCase()) 
        : true;
      const matchesType = searchCompanyType ? company.type === searchCompanyType : true;
      return matchesName && matchesType;
    });
    
    setFilteredCompanies(result);
    setIsSearched(true);
    setSelectedIds([]); // Clear selection when search changes
  };

  const clearSearch = () => {
    setSearchCompanyName('');
    setSearchCompanyType('');
    setFilteredCompanies(companies);
    setIsSearched(false);
    setSelectedIds([]);
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCompanies.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const idsToDelete = [...selectedIds];
    const remaining = companies.filter(c => !idsToDelete.includes(c.id));
    setCompanies(remaining);
    setSelectedIds([]);

    for (const id of idsToDelete) {
      try {
        await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Error deleting company from database:', err);
      }
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !companyTypeConstant) return;

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    const generatedId = Math.random().toString(36).substring(2, 9);

    const newComp = {
      id: generatedId,
      name: newCompanyName.trim(),
      type: companyTypeConstant,
      description: newDescription.trim(),
      modifiedDate: formattedDate,
      modifier: user?.username || 'admin'
    };

    setCompanies([newComp, ...companies]);
    
    try {
      await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newComp.id,
          name: newComp.name,
          type: newComp.type,
          description: newComp.description,
          modifier: newComp.modifier
        })
      });
    } catch (err) {
      console.error('Error persisting company to database:', err);
    }

    // Reset form
    setNewCompanyName('');
    setNewDescription('');
    setIsAddingCompany(false);
  };

  const handleCancelAdd = () => {
    setNewCompanyName('');
    setNewDescription('');
    setIsAddingCompany(false);
  };

  // Unique list of types for dropdown
  const uniqueCompanyTypes = Array.from(new Set(companies.map(c => c.type)));


  // ==========================================
  // STEP 2 STATES & LOGIC (Operator Connection)
  // ==========================================
  const [isAddingConnection, setIsAddingConnection] = useState(false);

  // Default values for dropdown selections
  const operatorOptions = ["M1", "MobiWeb", "Mocean", "MoceanNCS", "MoceanUS_UOB", "Oxygen8", "SendQuick", "Silverstreet", "SingTel", "Starhub", "Syniverse", "TPG", "Tyntec"];
  const protocolOptions = ["HTTP", "HTTPS", "SMPP", "SOAP", "TCP/IP"];

  // Operator Connections state with localStorage persistence
  const [connections, setConnections] = useState(() => {
    const saved = localStorage.getItem('tenant_connections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: '1',
        connectionName: 'M1 SMPP Main',
        operator: 'M1',
        protocol: 'SMPP',
        connectionUrl: 'smpp://smsc.m1.com.sg',
        hostName: 'smsc.m1.com.sg',
        port: '2775',
        loginId: 'm1_tenant',
        password: 'password123',
        bindType: 'TX/RX',
        smsThroughput: '100',
        bufferSize: '1000',
        timeout: '30',
        retryCount: '3',
        keepAliveInterval: '60',
        keepAliveEnabled: true,
        description: 'Primary connection to M1 SMS gateway',
        dedicatedConnection: true,
        internationalAllowed: false,
        roundRobinEnabled: true,
        mtShortcode: '61288',
        moShortcode: '81288',
        modifiedDate: '2026-06-25 15:10:45',
        modifier: 'admin'
      },
      {
        id: '2',
        connectionName: 'SingTel HTTP Backup',
        operator: 'SingTel',
        protocol: 'HTTP',
        connectionUrl: 'https://api.singtel.com/sms',
        hostName: 'api.singtel.com',
        port: '443',
        loginId: 'singtel_user',
        password: 'secret_key_abc',
        bindType: '',
        smsThroughput: '50',
        bufferSize: '500',
        timeout: '15',
        retryCount: '5',
        keepAliveInterval: '30',
        keepAliveEnabled: false,
        description: 'Backup HTTP service route',
        dedicatedConnection: false,
        internationalAllowed: true,
        roundRobinEnabled: false,
        mtShortcode: '65590',
        moShortcode: '85590',
        modifiedDate: '2026-06-24 11:24:15',
        modifier: 'admin'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tenant_connections', JSON.stringify(connections));
  }, [connections]);

  // Form states for adding an Operator Connection
  const [connName, setConnName] = useState('');
  const [connOperator, setConnOperator] = useState('');
  const [connProtocol, setConnProtocol] = useState('');
  const [connUrl, setConnUrl] = useState('');
  const [connHostName, setConnHostName] = useState('');
  const [connPort, setConnPort] = useState('');
  const [connLoginId, setConnLoginId] = useState('');
  const [connPassword, setConnPassword] = useState('');
  const [connBindType, setConnBindType] = useState('');
  const [connSmsThroughput, setConnSmsThroughput] = useState('');
  const [connBufferSize, setConnBufferSize] = useState('');
  const [connTimeout, setConnTimeout] = useState('');
  const [connRetryCount, setConnRetryCount] = useState('');
  const [connKeepAliveInterval, setConnKeepAliveInterval] = useState('');
  const [connKeepAliveEnabled, setConnKeepAliveEnabled] = useState(false);
  const [connDescription, setConnDescription] = useState('');
  const [connDedicated, setConnDedicated] = useState(false);
  const [connInternational, setConnInternational] = useState(false);
  const [connRoundRobin, setConnRoundRobin] = useState(false);

  // Search / Filter states for Step 2
  const [searchConnName, setSearchConnName] = useState('');
  const [searchConnOperator, setSearchConnOperator] = useState('');
  const [filteredConnections, setFilteredConnections] = useState(connections);
  const [isConnSearched, setIsConnSearched] = useState(false);
  const [selectedConnIds, setSelectedConnIds] = useState([]);

  // Sync filtered view with raw connections list
  useEffect(() => {
    if (!isConnSearched) {
      setFilteredConnections(connections);
    } else {
      applyConnSearch();
    }
  }, [connections, isConnSearched]);

  // Check if search buttons should be disabled for Step 2 (both inputs null / empty)
  const isConnSearchDisabled = !searchConnName.trim() && !searchConnOperator;

  const applyConnSearch = () => {
    if (isConnSearchDisabled) return;
    const result = connections.filter(conn => {
      const matchesName = searchConnName.trim() 
        ? conn.connectionName.toLowerCase().includes(searchConnName.trim().toLowerCase()) 
        : true;
      const matchesOperator = searchConnOperator ? conn.operator === searchConnOperator : true;
      return matchesName && matchesOperator;
    });
    setFilteredConnections(result);
    setIsConnSearched(true);
    setSelectedConnIds([]); // Clear selection when search changes
  };

  const clearConnSearch = () => {
    setSearchConnName('');
    setSearchConnOperator('');
    setFilteredConnections(connections);
    setIsConnSearched(false);
    setSelectedConnIds([]);
  };

  const handleSelectConnRow = (id) => {
    if (selectedConnIds.includes(id)) {
      setSelectedConnIds(selectedConnIds.filter(item => item !== id));
    } else {
      setSelectedConnIds([...selectedConnIds, id]);
    }
  };

  const handleSelectAllConns = (e) => {
    if (e.target.checked) {
      setSelectedConnIds(filteredConnections.map(c => c.id));
    } else {
      setSelectedConnIds([]);
    }
  };

  const handleDeleteSelectedConns = async () => {
    if (selectedConnIds.length === 0) return;
    const idsToDelete = [...selectedConnIds];
    const remaining = connections.filter(c => !idsToDelete.includes(c.id));
    setConnections(remaining);
    setSelectedConnIds([]);

    for (const id of idsToDelete) {
      try {
        await fetch(`/api/connections/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Error deleting connection from database:', err);
      }
    }
  };

  // Validator for Step 2 Save: All fields are required EXCEPT bindType, description, and the checkboxes
  const isConnFormValid = 
    connName.trim() !== '' &&
    connOperator !== '' &&
    connProtocol !== '' &&
    connUrl.trim() !== '' &&
    connHostName.trim() !== '' &&
    connPort.trim() !== '' &&
    connLoginId.trim() !== '' &&
    connPassword.trim() !== '' &&
    connSmsThroughput.trim() !== '' &&
    connBufferSize.trim() !== '' &&
    connTimeout.trim() !== '' &&
    connRetryCount.trim() !== '' &&
    connKeepAliveInterval.trim() !== '';

  const handleSaveConnection = async (e) => {
    e.preventDefault();
    if (!isConnFormValid) return;

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    const generatedId = Math.random().toString(36).substring(2, 9);

    // Auto-generate some realistic Shortcodes for list display as instructed
    const mtShortcodeVal = '6' + Math.floor(1000 + Math.random() * 9000);
    const moShortcodeVal = '8' + Math.floor(1000 + Math.random() * 9000);

    const newConn = {
      id: generatedId,
      connectionName: connName.trim(),
      operator: connOperator,
      protocol: connProtocol,
      connectionUrl: connUrl.trim(),
      hostName: connHostName.trim(),
      port: connPort.trim(),
      loginId: connLoginId.trim(),
      password: connPassword.trim(),
      bindType: connBindType.trim(),
      smsThroughput: connSmsThroughput.trim(),
      bufferSize: connBufferSize.trim(),
      timeout: connTimeout.trim(),
      retryCount: connRetryCount.trim(),
      keepAliveInterval: connKeepAliveInterval.trim(),
      keepAliveEnabled: connKeepAliveEnabled,
      description: connDescription.trim(),
      dedicatedConnection: connDedicated,
      internationalAllowed: connInternational,
      roundRobinEnabled: connRoundRobin,
      mtShortcode: mtShortcodeVal,
      moShortcode: moShortcodeVal,
      modifiedDate: formattedDate,
      modifier: user?.username || 'admin'
    };

    setConnections([newConn, ...connections]);

    try {
      await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConn)
      });
    } catch (err) {
      console.error('Error persisting connection to database:', err);
    }

    // Reset Form
    setConnName('');
    setConnOperator('');
    setConnProtocol('');
    setConnUrl('');
    setConnHostName('');
    setConnPort('');
    setConnLoginId('');
    setConnPassword('');
    setConnBindType('');
    setConnSmsThroughput('');
    setConnBufferSize('');
    setConnTimeout('');
    setConnRetryCount('');
    setConnKeepAliveInterval('');
    setConnKeepAliveEnabled(false);
    setConnDescription('');
    setConnDedicated(false);
    setConnInternational(false);
    setConnRoundRobin(false);

    setIsAddingConnection(false);
  };

  const handleCancelAddConnection = () => {
    setConnName('');
    setConnOperator('');
    setConnProtocol('');
    setConnUrl('');
    setConnHostName('');
    setConnPort('');
    setConnLoginId('');
    setConnPassword('');
    setConnBindType('');
    setConnSmsThroughput('');
    setConnBufferSize('');
    setConnTimeout('');
    setConnRetryCount('');
    setConnKeepAliveInterval('');
    setConnKeepAliveEnabled(false);
    setConnDescription('');
    setConnDedicated(false);
    setConnInternational(false);
    setConnRoundRobin(false);

    setIsAddingConnection(false);
  };


  // ==========================================
  // STEP 3 STATES & LOGIC (Tenant/CP Configuration)
  // ==========================================
  const [isAddingTenant, setIsAddingTenant] = useState(false);

  // Tenants state with localStorage persistence
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('tenant_configurations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 't1',
        cpCode: 'CP-DBS-01',
        companyName: 'DBS Bank',
        shortCode: '61288',
        applicationId: 'DBS_APP_ID',
        description: 'DBS Bank Main Transactional SMS',
        modifiedDate: '2026-06-25 16:45:22',
        modifier: 'admin'
      },
      {
        id: 't2',
        cpCode: 'CP-SGT-03',
        companyName: 'Singtel',
        shortCode: '65590',
        applicationId: 'SINGTEL_ALERT_ID',
        description: 'Singtel Network OTP Service',
        modifiedDate: '2026-06-24 10:30:15',
        modifier: 'admin'
      },
      {
        id: 't3',
        cpCode: 'CP-UOB-02',
        companyName: 'UOB Bank',
        shortCode: '81288',
        applicationId: 'UOB_OTP_ID',
        description: 'UOB Bank Primary OTP Alerts',
        modifiedDate: '2026-06-25 09:12:00',
        modifier: 'admin'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tenant_configurations', JSON.stringify(tenants));
  }, [tenants]);

  // Form states for adding a Tenant
  const [tenantCompany, setTenantCompany] = useState('');
  const [tenantCPCode, setTenantCPCode] = useState('');
  const [tenantShortCode, setTenantShortCode] = useState('');
  const [tenantAppId, setTenantAppId] = useState('');
  const [tenantPassword, setTenantPassword] = useState('');
  const [tenantMOCertName, setTenantMOCertName] = useState('');
  const [tenantMOAccessProto, setTenantMOAccessProto] = useState('');
  const [tenantSslEnabled, setTenantSslEnabled] = useState(false);
  const [tenantBounceUrl, setTenantBounceUrl] = useState('');
  const [tenantMoProdUrl, setTenantMoProdUrl] = useState('');
  const [tenantDlrStagingUrl, setTenantDlrStagingUrl] = useState('');
  const [tenantDlrProdUrl, setTenantDlrProdUrl] = useState('');
  const [tenantMtStagingUrl, setTenantMtStagingUrl] = useState('');
  const [tenantMtProdUrl1, setTenantMtProdUrl1] = useState('');
  const [tenantMtProdUrl2, setTenantMtProdUrl2] = useState('');
  const [tenantCpPortalUrl, setTenantCpPortalUrl] = useState('');
  const [tenantLocalRouting, setTenantLocalRouting] = useState('');
  const [tenantIntlRouting, setTenantIntlRouting] = useState('');
  const [tenantDesc, setTenantDesc] = useState('');

  // Form Checkbox states
  const [tenantMTService, setTenantMTService] = useState(false);
  const [tenantMOService, setTenantMOService] = useState(false);
  const [tenantMOConcatenation, setTenantMOConcatenation] = useState(false);
  const [tenantTPOA, setTenantTPOA] = useState(false);
  const [tenantAlternateRoute, setTenantAlternateRoute] = useState(false);
  const [tenantDeliveryReceipt, setTenantDeliveryReceipt] = useState(false);
  const [tenantLegacySupport, setTenantLegacySupport] = useState(false);
  const [tenantReturnDeliveryReceipt, setTenantReturnDeliveryReceipt] = useState(false);
  const [tenantDedicatedService, setTenantDedicatedService] = useState(false);
  const [tenantDivertPortedOutNumber, setTenantDivertPortedOutNumber] = useState(false);

  // Search & Filter states for Step 3
  const [searchTenantConnName, setSearchTenantConnName] = useState('');
  const [searchTenantCPCode, setSearchTenantCPCode] = useState('');
  const [searchTenantShortCode, setSearchTenantShortCode] = useState('');
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [isTenantSearched, setIsTenantSearched] = useState(false);
  const [selectedTenantIds, setSelectedTenantIds] = useState([]);
  const [alphabetFilter, setAlphabetFilter] = useState('ALL');

  // Drag-and-drop state for certificate PDF upload
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setTenantMOCertName(file.name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTenantMOCertName(file.name);
    }
  };

  // Sort and Sync filtered view of Tenants
  useEffect(() => {
    // Sort tenants alphabetically by CP Code by default as requested: "There should be a list below that can be filtered alphabetically in CP code"
    let baseList = [...tenants].sort((a, b) => (a.cpCode || '').localeCompare(b.cpCode || ''));

    if (isTenantSearched) {
      baseList = baseList.filter(tenant => {
        const matchesConn = searchTenantConnName.trim()
          ? (tenant.companyName || '').toLowerCase().includes(searchTenantConnName.trim().toLowerCase())
          : true;
        const matchesCP = searchTenantCPCode.trim()
          ? (tenant.cpCode || '').toLowerCase().includes(searchTenantCPCode.trim().toLowerCase())
          : true;
        const matchesShort = searchTenantShortCode.trim()
          ? (tenant.shortCode || '').toLowerCase().includes(searchTenantShortCode.trim().toLowerCase())
          : true;
        return matchesConn && matchesCP && matchesShort;
      });
    }

    if (alphabetFilter !== 'ALL') {
      baseList = baseList.filter(tenant => {
        const firstChar = (tenant.cpCode || '').trim().toUpperCase().charAt(0);
        if (alphabetFilter === 'A-E') return /[A-E]/.test(firstChar);
        if (alphabetFilter === 'F-J') return /[F-J]/.test(firstChar);
        if (alphabetFilter === 'K-O') return /[K-O]/.test(firstChar);
        if (alphabetFilter === 'P-T') return /[P-T]/.test(firstChar);
        if (alphabetFilter === 'U-Z') return /[U-Z]/.test(firstChar);
        return true;
      });
    }

    setFilteredTenants(baseList);
  }, [tenants, isTenantSearched, searchTenantConnName, searchTenantCPCode, searchTenantShortCode, alphabetFilter]);

  const isTenantSearchDisabled = !searchTenantConnName.trim() && !searchTenantCPCode.trim() && !searchTenantShortCode.trim();

  const handleTenantSearch = () => {
    if (isTenantSearchDisabled) return;
    setIsTenantSearched(true);
    setSelectedTenantIds([]);
  };

  const handleClearTenantSearch = () => {
    setSearchTenantConnName('');
    setSearchTenantCPCode('');
    setSearchTenantShortCode('');
    setIsTenantSearched(false);
    setSelectedTenantIds([]);
  };

  const handleSelectTenantRow = (id) => {
    if (selectedTenantIds.includes(id)) {
      setSelectedTenantIds(selectedTenantIds.filter(item => item !== id));
    } else {
      setSelectedTenantIds([...selectedTenantIds, id]);
    }
  };

  const handleSelectAllTenants = (e) => {
    if (e.target.checked) {
      setSelectedTenantIds(filteredTenants.map(t => t.id));
    } else {
      setSelectedTenantIds([]);
    }
  };

  const handleDeleteSelectedTenants = async () => {
    if (selectedTenantIds.length === 0) return;
    const idsToDelete = [...selectedTenantIds];
    const remaining = tenants.filter(t => !idsToDelete.includes(t.id));
    setTenants(remaining);
    setSelectedTenantIds([]);

    for (const id of idsToDelete) {
      try {
        await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Error deleting tenant config from database:', err);
      }
    }
  };

  const isTenantFormValid = tenantCompany !== '' && tenantCPCode.trim() !== '' && tenantShortCode.trim() !== '';

  const handleSaveTenant = async (e) => {
    e.preventDefault();
    if (!isTenantFormValid) return;

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    const generatedId = Math.random().toString(36).substring(2, 9);

    const newTenant = {
      id: generatedId,
      cpCode: tenantCPCode.trim(),
      companyName: tenantCompany,
      shortCode: tenantShortCode.trim(),
      applicationId: tenantAppId.trim() || 'N/A',
      password: tenantPassword,
      moCertificateName: tenantMOCertName || 'None',
      moAccessProtocol: tenantMOAccessProto,
      sslEnabled: tenantSslEnabled,
      bounceSmsUrl: tenantBounceUrl.trim(),
      moProductionUrl: tenantMoProdUrl.trim(),
      dlrStagingUrl: tenantDlrStagingUrl.trim(),
      dlrProductionUrl: tenantDlrProdUrl.trim(),
      mtStagingUrl: tenantMtStagingUrl.trim(),
      mtProductionUrl1: tenantMtProdUrl1.trim(),
      mtProductionUrl2: tenantMtProdUrl2.trim(),
      cpPortalUrl: tenantCpPortalUrl.trim(),
      localRoutingOperator: tenantLocalRouting,
      internationalRoutingOperator: tenantIntlRouting,
      description: tenantDesc.trim() || 'None',
      mtService: tenantMTService,
      moService: tenantMOService,
      moConcatenation: tenantMOConcatenation,
      tpoa: tenantTPOA,
      alternateRoute: tenantAlternateRoute,
      deliveryReceipt: tenantDeliveryReceipt,
      legacySupport: tenantLegacySupport,
      returnDeliveryReceipt: tenantReturnDeliveryReceipt,
      dedicatedService: tenantDedicatedService,
      divertPortedOutNumber: tenantDivertPortedOutNumber,
      modifiedDate: formattedDate,
      modifier: user?.username || 'admin'
    };

    setTenants([newTenant, ...tenants]);

    try {
      await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenant)
      });
    } catch (err) {
      console.error('Error persisting tenant config to database:', err);
    }

    // Reset fields
    setTenantCompany('');
    setTenantCPCode('');
    setTenantShortCode('');
    setTenantAppId('');
    setTenantPassword('');
    setTenantMOCertName('');
    setTenantMOAccessProto('');
    setTenantSslEnabled(false);
    setTenantBounceUrl('');
    setTenantMoProdUrl('');
    setTenantDlrStagingUrl('');
    setTenantDlrProdUrl('');
    setTenantMtStagingUrl('');
    setTenantMtProdUrl1('');
    setTenantMtProdUrl2('');
    setTenantCpPortalUrl('');
    setTenantLocalRouting('');
    setTenantIntlRouting('');
    setTenantDesc('');
    setTenantMTService(false);
    setTenantMOService(false);
    setTenantMOConcatenation(false);
    setTenantTPOA(false);
    setTenantAlternateRoute(false);
    setTenantDeliveryReceipt(false);
    setTenantLegacySupport(false);
    setTenantReturnDeliveryReceipt(false);
    setTenantDedicatedService(false);
    setTenantDivertPortedOutNumber(false);

    setIsAddingTenant(false);
  };

  const handleCancelTenant = () => {
    setTenantCompany('');
    setTenantCPCode('');
    setTenantShortCode('');
    setTenantAppId('');
    setTenantPassword('');
    setTenantMOCertName('');
    setTenantMOAccessProto('');
    setTenantSslEnabled(false);
    setTenantBounceUrl('');
    setTenantMoProdUrl('');
    setTenantDlrStagingUrl('');
    setTenantDlrProdUrl('');
    setTenantMtStagingUrl('');
    setTenantMtProdUrl1('');
    setTenantMtProdUrl2('');
    setTenantCpPortalUrl('');
    setTenantLocalRouting('');
    setTenantIntlRouting('');
    setTenantDesc('');
    setTenantMTService(false);
    setTenantMOService(false);
    setTenantMOConcatenation(false);
    setTenantTPOA(false);
    setTenantAlternateRoute(false);
    setTenantDeliveryReceipt(false);
    setTenantLegacySupport(false);
    setTenantReturnDeliveryReceipt(false);
    setTenantDedicatedService(false);
    setTenantDivertPortedOutNumber(false);

    setIsAddingTenant(false);
  };


  // ==========================================
  // RENDERING LOGIC FOR ADD VIEWS
  // ==========================================
  if (isAddingCompany) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-300 pb-2">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Company Profile Configuration</h1>
            <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
              Logged in as: <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono text-xs">{user?.username || 'N/A'}</span>
            </p>
          </div>
          <button 
            onClick={handleCancelAdd}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded border border-slate-200 shadow-sm p-5 max-w-xl">
          <form onSubmit={handleSaveCompany} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Company Type
              </label>
              <input
                type="text"
                value={companyTypeConstant}
                disabled
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-slate-100 text-slate-500 font-medium cursor-not-allowed outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">This field is restricted to Content Provider operations.</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Company Name"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter Description of the company..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={handleCancelAdd}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCompanyName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (isAddingConnection) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-300 pb-2">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Operator Connection Configuration</h1>
            <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
              Logged in as: <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono text-xs">{user?.username || 'N/A'}</span>
            </p>
          </div>
          <button 
            onClick={handleCancelAddConnection}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded border border-slate-200 shadow-sm p-6 max-w-2xl">
          <form onSubmit={handleSaveConnection} className="flex flex-col gap-4">
            
            {/* Connection Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Connection Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Connection Name"
                value={connName}
                onChange={(e) => setConnName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Operator Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Operator <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={connOperator}
                onChange={(e) => setConnOperator(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="">-- Select Operator --</option>
                {operatorOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Protocol Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Protocol <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={connProtocol}
                onChange={(e) => setConnProtocol(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="">-- Select Protocol --</option>
                {protocolOptions.map(proto => (
                  <option key={proto} value={proto}>{proto}</option>
                ))}
              </select>
            </div>

            {/* Connection URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Connection URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. smpp://smsc.operator.com"
                value={connUrl}
                onChange={(e) => setConnUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* HostName */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Host Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. smsc.operator.com"
                value={connHostName}
                onChange={(e) => setConnHostName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Port */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Port <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2775 or 443"
                value={connPort}
                onChange={(e) => setConnPort(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Login ID */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Login ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter Login Username"
                value={connLoginId}
                onChange={(e) => setConnLoginId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Password and Bind Type should be side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={connPassword}
                  onChange={(e) => setConnPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Bind Type <span className="text-slate-400 font-normal lowercase">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TX/RX"
                  value={connBindType}
                  onChange={(e) => setConnBindType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* SMS Throughput */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                SMS Throughput (Per Second) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 100"
                value={connSmsThroughput}
                onChange={(e) => setConnSmsThroughput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Buffer Size */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Buffer Size <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1000"
                value={connBufferSize}
                onChange={(e) => setConnBufferSize(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Timeout (Second) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Timeout (Second) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 30"
                value={connTimeout}
                onChange={(e) => setConnTimeout(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Retry Count */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Retry Count <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3"
                value={connRetryCount}
                onChange={(e) => setConnRetryCount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Keep Alive Interval & Enabled checkbox */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Keep Alive Interval (Second) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. 60"
                  value={connKeepAliveInterval}
                  onChange={(e) => setConnKeepAliveInterval(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none font-medium mt-1">
                  <input
                    type="checkbox"
                    checked={connKeepAliveEnabled}
                    onChange={(e) => setConnKeepAliveEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  Enabled
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Description <span className="text-slate-400 font-normal lowercase">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Provide operator channel description..."
                value={connDescription}
                onChange={(e) => setConnDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Dedicated Connection & International Allowed should be in one row side by side */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={connDedicated}
                  onChange={(e) => setConnDedicated(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Dedicated Connection</span>
                  <p className="text-[10px] text-slate-400 font-normal">Allocate exclusive network bandwidth</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={connInternational}
                  onChange={(e) => setConnInternational(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">International Allowed</span>
                  <p className="text-[10px] text-slate-400 font-normal">Enable routing to overseas carriers</p>
                </div>
              </label>
            </div>

            {/* Round-Robin Enabled */}
            <div className="mt-1">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={connRoundRobin}
                  onChange={(e) => setConnRoundRobin(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Round-Robin Enabled</span>
                  <p className="text-[10px] text-slate-400 font-normal">Load balance sequentially across active connections</p>
                </div>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelAddConnection}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isConnFormValid}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }

  if (isAddingTenant) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-300 pb-2">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Tenant Configuration (Content Provider Service Configuration)</h1>
            <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
              Logged in as: <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono text-xs">{user?.username || 'admin'}</span>
            </p>
          </div>
          <button
            onClick={handleCancelTenant}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white rounded border border-slate-200 shadow-sm p-6 max-w-2xl">
          <form onSubmit={handleSaveTenant} className="flex flex-col gap-4">
            
            {/* Company Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <select
                value={tenantCompany}
                onChange={(e) => setTenantCompany(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              >
                <option value="">-- Select Company Profile --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            {/* CP Code */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                CP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tenantCPCode}
                onChange={(e) => setTenantCPCode(e.target.value)}
                placeholder="e.g. CP-DBS-01"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* Short Code */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Short Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tenantShortCode}
                onChange={(e) => setTenantShortCode(e.target.value)}
                placeholder="e.g. 61288"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* Application ID */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Application ID
              </label>
              <input
                type="text"
                value={tenantAppId}
                onChange={(e) => setTenantAppId(e.target.value)}
                placeholder="e.g. APP_DBS_TRANS"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={tenantPassword}
                onChange={(e) => setTenantPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* MO Certificate Upload */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                MO Certificate
              </label>
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2",
                  dragActive ? "border-indigo-500 bg-indigo-50/40" : "border-slate-300 bg-slate-50 hover:bg-slate-100/50"
                )}
                onClick={() => document.getElementById('tenant-mo-file-input').click()}
              >
                <input
                  id="tenant-mo-file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {tenantMOCertName ? (
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="w-8 h-8 text-emerald-600 animate-bounce" />
                    <div>
                      <span className="text-xs font-bold text-slate-800">{tenantMOCertName}</span>
                      <p className="text-[9px] text-slate-400">PDF Document ready to attach</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTenantMOCertName('');
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline uppercase tracking-wider mt-1"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-700">Drag & Drop MO Certificate file here</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">or <span className="text-indigo-600 font-bold underline">browse local files</span> (preferably PDF format)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MO Access Protocol & SSL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                MO Access Protocol
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={tenantMOAccessProto}
                  onChange={(e) => setTenantMOAccessProto(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
                >
                  <option value="">-- Select Protocol --</option>
                  <option value="HTTP">HTTP</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="SOAP">SOAP</option>
                  <option value="SMPP">SMPP</option>
                </select>
                <label className="flex items-center gap-1.5 bg-slate-50 px-3 border border-slate-300 rounded h-9 cursor-pointer hover:bg-slate-100 select-none">
                  <input
                    type="checkbox"
                    checked={tenantSslEnabled}
                    onChange={(e) => setTenantSslEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-600">SSL</span>
                </label>
              </div>
            </div>

            {/* Bounce SMS URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Bounce SMS URL
              </label>
              <input
                type="url"
                value={tenantBounceUrl}
                onChange={(e) => setTenantBounceUrl(e.target.value)}
                placeholder="https://api.domain.com/sms/bounce"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* MO Production URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                MO Production URL
              </label>
              <input
                type="url"
                value={tenantMoProdUrl}
                onChange={(e) => setTenantMoProdUrl(e.target.value)}
                placeholder="https://api.domain.com/sms/mo-receive"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* DLR Staging URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                DLR Staging URL
              </label>
              <input
                type="url"
                value={tenantDlrStagingUrl}
                onChange={(e) => setTenantDlrStagingUrl(e.target.value)}
                placeholder="https://staging.domain.com/dlr"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* DLR Production URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                DLR Production URL
              </label>
              <input
                type="url"
                value={tenantDlrProdUrl}
                onChange={(e) => setTenantDlrProdUrl(e.target.value)}
                placeholder="https://api.domain.com/dlr"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* MT Staging URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                MT Staging URL
              </label>
              <input
                type="url"
                value={tenantMtStagingUrl}
                onChange={(e) => setTenantMtStagingUrl(e.target.value)}
                placeholder="https://staging.domain.com/mt"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* MT Production URL 1 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                MT Production URL 1
              </label>
              <input
                type="url"
                value={tenantMtProdUrl1}
                onChange={(e) => setTenantMtProdUrl1(e.target.value)}
                placeholder="https://api1.domain.com/mt"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* MT Production URL 2 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                MT Production URL 2
              </label>
              <input
                type="url"
                value={tenantMtProdUrl2}
                onChange={(e) => setTenantMtProdUrl2(e.target.value)}
                placeholder="https://api2.domain.com/mt"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* CP Portal URL */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                CP Portal URL
              </label>
              <input
                type="url"
                value={tenantCpPortalUrl}
                onChange={(e) => setTenantCpPortalUrl(e.target.value)}
                placeholder="https://portal.domain.com/login"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* Local Routing Operator */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Local Routing Operator
              </label>
              <select
                value={tenantLocalRouting}
                onChange={(e) => setTenantLocalRouting(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              >
                <option value="">-- Select Local Operator --</option>
                {[
                  "Number Portability using Tyntec",
                  "Number Portability using Local Operator",
                  ...operatorOptions
                ].map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            {/* International Routing Operator */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                International Routing Operator
              </label>
              <select
                value={tenantIntlRouting}
                onChange={(e) => setTenantIntlRouting(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              >
                <option value="">-- Select International Operator --</option>
                {operatorOptions.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <input
                type="text"
                value={tenantDesc}
                onChange={(e) => setTenantDesc(e.target.value)}
                placeholder="Enter additional description, notes or internal billing keys..."
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow h-9"
              />
            </div>

            {/* Checkboxes: MT Service & MO Service */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantMTService}
                  onChange={(e) => setTenantMTService(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">MT Service</span>
                  <p className="text-[10px] text-slate-400 font-normal">Enables Mobile-Terminated SMS broadcasts & pushes</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantMOService}
                  onChange={(e) => setTenantMOService(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">MO Service</span>
                  <p className="text-[10px] text-slate-400 font-normal">Enables Mobile-Originated inbound processing</p>
                </div>
              </label>
            </div>

            {/* Checkboxes: MO Concatenation & TPOA */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantMOConcatenation}
                  onChange={(e) => setTenantMOConcatenation(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">MO Concatenation</span>
                  <p className="text-[10px] text-slate-400 font-normal">Allows joining multipart inbound texts seamlessly</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantTPOA}
                  onChange={(e) => setTenantTPOA(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">TPOA</span>
                  <p className="text-[10px] text-slate-400 font-normal">Enforce custom transmission origin addressing rules</p>
                </div>
              </label>
            </div>

            {/* Checkboxes: Alternate Route & Delivery Receipt */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantAlternateRoute}
                  onChange={(e) => setTenantAlternateRoute(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Alternate Route</span>
                  <p className="text-[10px] text-slate-400 font-normal">Fallbacks automatically if principal node drops down</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantDeliveryReceipt}
                  onChange={(e) => setTenantDeliveryReceipt(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Delivery Receipt</span>
                  <p className="text-[10px] text-slate-400 font-normal">Generates callback receipts for SMS broadcasts</p>
                </div>
              </label>
            </div>

            {/* Checkboxes: Legacy Support & Return Delivery Receipt */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantLegacySupport}
                  onChange={(e) => setTenantLegacySupport(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Legacy Support</span>
                  <p className="text-[10px] text-slate-400 font-normal">Supports old format and structure payloads safely</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantReturnDeliveryReceipt}
                  onChange={(e) => setTenantReturnDeliveryReceipt(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Return Delivery Receipt</span>
                  <p className="text-[10px] text-slate-400 font-normal">Forwards final network provider receipts directly to client</p>
                </div>
              </label>
            </div>

            {/* Checkboxes: Dedicated Service & Divert Ported Out Number */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantDedicatedService}
                  onChange={(e) => setTenantDedicatedService(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Dedicated Service</span>
                  <p className="text-[10px] text-slate-400 font-normal">Isolates CPU and queues to this content provider solely</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded border border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tenantDivertPortedOutNumber}
                  onChange={(e) => setTenantDivertPortedOutNumber(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700">Divert Ported Out Number</span>
                  <p className="text-[10px] text-slate-400 font-normal">Autodetects MNPs to rewrite target operator IDs</p>
                </div>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelTenant}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isTenantFormValid}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-300">
        <div className="flex gap-6 font-sans">
          <button
            onClick={() => setActiveStep('step1')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeStep === 'step1' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Step 1
          </button>
          <button
            onClick={() => setActiveStep('step2')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeStep === 'step2' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Step 2
          </button>
          <button
            onClick={() => setActiveStep('step3')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeStep === 'step3' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Step 3
          </button>
        </div>
        <div className="mb-2 text-xs text-slate-400 font-medium">
          Manage Tenant Workspace
        </div>
      </div>

      {/* STEP 1 VIEW */}
      {activeStep === 'step1' && (
        <div className="flex flex-col gap-4">
          {/* Subtitle / Header */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col gap-1">
            <h2 className="text-sm font-bold text-slate-900">Company Profile Configuration</h2>
            <p className="text-[11px] text-slate-400">Configure core content provider profiles, assign secure tenant modifiers, and search profiles.</p>
          </div>

          {/* Filters / Dropdowns & Action Buttons */}
          <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Company Name TEXT INPUT */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Company Name</span>
                <input
                  type="text"
                  placeholder="Enter Company Name"
                  value={searchCompanyName}
                  onChange={(e) => setSearchCompanyName(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white min-w-[170px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Company Type Dropdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Company Type</span>
                <select
                  value={searchCompanyType}
                  onChange={(e) => setSearchCompanyType(e.target.value)}
                  className="px-2 py-1.5 text-xs border border-slate-300 rounded bg-white min-w-[170px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Select Type --</option>
                  {uniqueCompanyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Search button & Clear */}
              <div className="flex items-end gap-2 h-10 pt-4">
                <button
                  onClick={applySearch}
                  disabled={isSearchDisabled}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider",
                    isSearchDisabled 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
                  )}
                >
                  <Search className="w-3 h-3" />
                  Search
                </button>
                {isSearched && (
                  <button
                    onClick={clearSearch}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Add & Delete Actions placed beside Search area */}
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => setIsAddingCompany(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                ADD
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider",
                  selectedIds.length === 0
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete ({selectedIds.length})
              </button>
            </div>
          </div>

          {/* Companies List Table */}
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-slate-50/75 border-b border-slate-200">
                  <tr className="text-slate-400 uppercase">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={filteredCompanies.length > 0 && selectedIds.length === filteredCompanies.length}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3 font-semibold w-16">S/No.</th>
                    <th className="p-3 font-semibold">Company Name</th>
                    <th className="p-3 font-semibold">Company Type</th>
                    <th className="p-3 font-semibold">Modified Date</th>
                    <th className="p-3 font-semibold">Modifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        {isSearched 
                          ? "No profiles match current filter criteria. Try expanding search tags." 
                          : "No configured tenant company profiles found."}
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company, index) => {
                      const isChecked = selectedIds.includes(company.id);
                      return (
                        <tr key={company.id} className={cn("hover:bg-slate-50/50 transition-colors", isChecked && "bg-indigo-50/10")}>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectRow(company.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-mono text-slate-400">{index + 1}</td>
                          <td className="p-3 font-bold text-slate-800">{company.name}</td>
                          <td className="p-3 font-semibold text-slate-600">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/50 text-[10px]">
                              {company.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 font-mono">{ensureTimestamp(company.modifiedDate)}</td>
                          <td className="p-3 text-slate-500 font-mono">@{company.modifier}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50/50 border-t border-slate-200 p-2.5 px-3 flex justify-between items-center text-[10px] text-slate-400">
              <span>Showing {filteredCompanies.length} of {companies.length} Profiles</span>
              {isSearched && <span className="font-semibold text-indigo-600">Active Search Filters Applied</span>}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 VIEW */}
      {activeStep === 'step2' && (
        <div className="flex flex-col gap-4">
          {/* Subtitle / Header */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col gap-1">
            <h2 className="text-sm font-bold text-slate-900 font-sans">Operator Connection Configuration</h2>
            <p className="text-[11px] text-slate-400">Configure carrier and gateway routing nodes, protocol bind options, and dedicated release parameters.</p>
          </div>

          {/* Filters / Dropdowns & Action Buttons */}
          <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Connection Name Textfield */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Connection Name</span>
                <input
                  type="text"
                  placeholder="Enter Connection Name"
                  value={searchConnName}
                  onChange={(e) => setSearchConnName(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white min-w-[170px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Operator Dropdown */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Operator</span>
                <select
                  value={searchConnOperator}
                  onChange={(e) => setSearchConnOperator(e.target.value)}
                  className="px-2 py-1.5 text-xs border border-slate-300 rounded bg-white min-w-[170px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Select Operator --</option>
                  {operatorOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Search button & Clear */}
              <div className="flex items-end gap-2 h-10 pt-4">
                <button
                  onClick={applyConnSearch}
                  disabled={isConnSearchDisabled}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider",
                    isConnSearchDisabled 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
                  )}
                >
                  <Search className="w-3 h-3" />
                  Search
                </button>
                {isConnSearched && (
                  <button
                    onClick={clearConnSearch}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Add & Delete Actions placed beside Search area */}
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => setIsAddingConnection(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
              <button
                onClick={handleDeleteSelectedConns}
                disabled={selectedConnIds.length === 0}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider",
                  selectedConnIds.length === 0
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete ({selectedConnIds.length})
              </button>
            </div>
          </div>

          {/* Connections List Table */}
          <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-slate-50/75 border-b border-slate-200">
                  <tr className="text-slate-400 uppercase">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAllConns}
                        checked={filteredConnections.length > 0 && selectedConnIds.length === filteredConnections.length}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3 font-semibold w-16">S/No.</th>
                    <th className="p-3 font-semibold">Connection Name</th>
                    <th className="p-3 font-semibold">Operator</th>
                    <th className="p-3 font-semibold">Protocol</th>
                    <th className="p-3 font-semibold">Host Name</th>
                    <th className="p-3 font-semibold">MT Shortcode/TPOA</th>
                    <th className="p-3 font-semibold">MO Shortcode/TPOA</th>
                    <th className="p-3 font-semibold">Modified Date</th>
                    <th className="p-3 font-semibold">Modifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredConnections.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400 italic">
                        {isConnSearched 
                          ? "No connections match current filter criteria. Try expanding search tags." 
                          : "No configured operator gateway connections found."}
                      </td>
                    </tr>
                  ) : (
                    filteredConnections.map((conn, index) => {
                      const isChecked = selectedConnIds.includes(conn.id);
                      return (
                        <tr key={conn.id} className={cn("hover:bg-slate-50/50 transition-colors", isChecked && "bg-indigo-50/10")}>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectConnRow(conn.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-mono text-slate-400">{index + 1}</td>
                          <td className="p-3 font-bold text-slate-800">
                            <div className="flex flex-col gap-0.5">
                              <span>{conn.connectionName}</span>
                              {conn.dedicatedConnection && (
                                <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold uppercase tracking-wider px-1 py-0.2 w-fit rounded border border-emerald-100">
                                  Dedicated
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-slate-600">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/50 text-[10px]">
                              {conn.operator}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-indigo-600 font-mono">{conn.protocol}</td>
                          <td className="p-3 text-slate-500 font-mono">{conn.hostName || 'N/A'}</td>
                          <td className="p-3 text-slate-500 font-mono font-bold">{conn.mtShortcode || 'N/A'}</td>
                          <td className="p-3 text-slate-500 font-mono font-bold">{conn.moShortcode || 'N/A'}</td>
                          <td className="p-3 text-slate-500 font-mono">{ensureTimestamp(conn.modifiedDate)}</td>
                          <td className="p-3 text-slate-500 font-mono">@{conn.modifier}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50/50 border-t border-slate-200 p-2.5 px-3 flex justify-between items-center text-[10px] text-slate-400">
              <span>Showing {filteredConnections.length} of {connections.length} Connection Nodes</span>
              {isConnSearched && <span className="font-semibold text-indigo-600">Active Search Filters Applied</span>}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 VIEW (Tenant Configuration) */}
      {activeStep === 'step3' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          
          {/* Subtitle / Header */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col gap-1">
            <h2 className="text-sm font-bold text-slate-900 font-sans">Tenant Configuration (Content Provider Service Configuration)</h2>
            <p className="text-[11px] text-slate-400">Manage service provider content codes, routing maps and destination delivery protocols</p>
          </div>

          {/* Filtering Controls & Command Bar */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col gap-4">
            
            {/* Search Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connection Name</label>
                <input
                  type="text"
                  value={searchTenantConnName}
                  onChange={(e) => setSearchTenantConnName(e.target.value)}
                  placeholder="e.g. DBS Bank"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white h-8"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CP Code</label>
                <input
                  type="text"
                  value={searchTenantCPCode}
                  onChange={(e) => setSearchTenantCPCode(e.target.value)}
                  placeholder="e.g. CP-DBS-01"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white h-8"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short Code</label>
                <input
                  type="text"
                  value={searchTenantShortCode}
                  onChange={(e) => setSearchTenantShortCode(e.target.value)}
                  placeholder="e.g. 61288"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white h-8"
                />
              </div>

              {/* Action Buttons beside the search */}
              <div className="flex gap-1.5 justify-start sm:justify-end md:justify-start">
                
                <button
                  onClick={handleTenantSearch}
                  disabled={isTenantSearchDisabled}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider h-8 flex-1 sm:flex-initial",
                    isTenantSearchDisabled
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm"
                  )}
                  title="Search requires at least one field to be non-empty"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>

                {isTenantSearched && (
                  <button
                    onClick={handleClearTenantSearch}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors uppercase tracking-wider h-8"
                  >
                    Clear
                  </button>
                )}

                {/* Add button */}
                <button
                  onClick={() => setIsAddingTenant(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-1 uppercase tracking-wider h-8 flex-1 sm:flex-initial"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>

                {/* Delete button */}
                <button
                  onClick={handleDeleteSelectedTenants}
                  disabled={selectedTenantIds.length === 0}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded transition-colors flex items-center justify-center gap-1 uppercase tracking-wider h-8 flex-1 sm:flex-initial",
                    selectedTenantIds.length === 0
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
                  )}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>

              </div>
            </div>

            {/* Alphabetical Quick Filters for CP Code */}
            <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fast-Filter CP Code Alphabetically:</span>
              <div className="flex flex-wrap gap-1">
                {['ALL', 'A-E', 'F-J', 'K-O', 'P-T', 'U-Z'].map((letterRange) => (
                  <button
                    key={letterRange}
                    onClick={() => setAlphabetFilter(letterRange)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all border",
                      alphabetFilter === letterRange
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs"
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    {letterRange}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Table displaying tenants */}
          <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredTenants.length > 0 && selectedTenantIds.length === filteredTenants.length}
                        onChange={handleSelectAllTenants}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3 w-12 text-center">S/No.</th>
                    <th className="p-3 font-semibold">CP Code</th>
                    <th className="p-3 font-semibold">Company Name</th>
                    <th className="p-3 font-semibold">Short Code</th>
                    <th className="p-3 font-semibold">Application ID</th>
                    <th className="p-3 font-semibold">Description</th>
                    <th className="p-3 font-semibold">Modified Date</th>
                    <th className="p-3 font-semibold">Modifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-12 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <HelpCircle className="w-8 h-8 text-slate-300 animate-pulse" />
                          <span>No Tenant Profiles found matching search criteria.</span>
                          <p className="text-[10px] text-slate-400 font-normal">Please add a new Tenant profile or adjust search parameters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((tenant, index) => {
                      const isChecked = selectedTenantIds.includes(tenant.id);
                      return (
                        <tr key={tenant.id} className={cn("hover:bg-slate-50/50 transition-colors", isChecked && "bg-indigo-50/10")}>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectTenantRow(tenant.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-center font-mono text-slate-400">{index + 1}</td>
                          <td className="p-3 font-bold text-indigo-700 font-mono">
                            {tenant.cpCode}
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {tenant.companyName}
                          </td>
                          <td className="p-3 font-bold text-slate-600 font-mono bg-slate-50/50">
                            {tenant.shortCode}
                          </td>
                          <td className="p-3 text-slate-600 font-mono">
                            {tenant.applicationId || 'N/A'}
                          </td>
                          <td className="p-3 text-slate-500 max-w-xs truncate" title={tenant.description}>
                            {tenant.description || 'None'}
                          </td>
                          <td className="p-3 text-slate-500 font-mono">{ensureTimestamp(tenant.modifiedDate)}</td>
                          <td className="p-3 text-slate-500 font-mono">@{tenant.modifier}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50/50 border-t border-slate-200 p-2.5 px-3 flex justify-between items-center text-[10px] text-slate-400">
              <span>Showing {filteredTenants.length} of {tenants.length} Tenants</span>
              {(isTenantSearched || alphabetFilter !== 'ALL') && (
                <span className="font-semibold text-indigo-600">Active Search / Alphabetical Filters Applied</span>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
