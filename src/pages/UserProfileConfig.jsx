import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Info, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Check, 
  X,
  UserCheck,
  Save
} from 'lucide-react';

export function UserProfileConfig({ user }) {
  // Current user's Login ID
  const loginUserText = user?.username || user?.email || user?.loginId || 'admin';

  // State for views: 'list' | 'add'
  const [view, setView] = useState('list');

  // Load initial companies list from Step 1
  const [companies, setCompanies] = useState([]);
  
  // Load profiles from API/localStorage with fallback
  const [profiles, setProfiles] = useState([
    { id: 'p1', name: 'Albert Tan', company: 'DBS Bank', email: 'albert_tan@dbsbank.com', loginId: 'albert_tan' },
    { id: 'p2', name: 'Beatrice Lim', company: 'UOB Bank', email: 'beatrice_lim@uobbank.com', loginId: 'beatrice_lim' },
    { id: 'p3', name: 'Charlie Sng', company: 'Singtel', email: 'charlie_sng@singtel.com', loginId: 'charlie_sng' }
  ]);

  useEffect(() => {
    const syncCompaniesAndProfiles = async () => {
      // 1. Fetch companies
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setCompanies(data.data);
        } else {
          const saved = localStorage.getItem('tenant_companies');
          if (saved) {
            setCompanies(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.warn('Backend API /api/companies offline or not loaded in UserProfileConfig:', err);
        const saved = localStorage.getItem('tenant_companies');
        if (saved) {
          setCompanies(JSON.parse(saved));
        }
      }

      // 2. Fetch profiles
      try {
        const res = await fetch('/api/user-profiles');
        const data = await res.json();
        if (data.success && data.data) {
          const norm = data.data.map(p => ({
            id: p.id,
            name: p.first_name !== undefined ? p.first_name : p.name,
            company: p.company_name !== undefined ? p.company_name : p.company,
            email: p.email,
            loginId: p.login_id !== undefined ? p.login_id : p.loginId
          }));
          setProfiles(norm);
        } else {
          const saved = localStorage.getItem('tenant_user_profiles');
          if (saved) {
            setProfiles(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.warn('Backend API /api/user-profiles offline or not loaded:', err);
        const saved = localStorage.getItem('tenant_user_profiles');
        if (saved) {
          setProfiles(JSON.parse(saved));
        }
      }
    };
    syncCompaniesAndProfiles();
  }, [view]);

  // Save profiles to localStorage whenever it changes as a local backup
  useEffect(() => {
    localStorage.setItem('tenant_user_profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Search/Filter states
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [appliedSearchName, setAppliedSearchName] = useState('');
  const [appliedSearchCompany, setAppliedSearchCompany] = useState('');

  // Sort direction: 'asc' = A-Z, 'desc' = Z-A
  const [sortDirection, setSortDirection] = useState('asc');

  // Selected row IDs for batch deletion
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Form states for Add Profile
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formCompanyAccess, setFormCompanyAccess] = useState('');
  const [formLoginId, setFormLoginId] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Success / error message banners
  const [feedback, setFeedback] = useState(null);

  // Handler to clear search state
  const handleClearSearch = () => {
    setSearchName('');
    setSearchCompany('');
    setAppliedSearchName('');
    setAppliedSearchCompany('');
  };

  // Toggle single row selection
  const handleToggleSelectRow = (id) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  // Toggle select all rows
  const handleToggleSelectAll = (filteredList) => {
    if (selectedIds.size === filteredList.length && filteredList.length > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = filteredList.map(item => item.id);
      setSelectedIds(new Set(allIds));
    }
  };

  // Delete checked rows
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    
    const remaining = profiles.filter(item => !selectedIds.has(item.id));
    setProfiles(remaining);
    setSelectedIds(new Set());

    for (const id of idsToDelete) {
      try {
        await fetch(`/api/user-profiles/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Error deleting user profile from database:', err);
      }
    }

    showToast('success', `Successfully deleted ${idsToDelete.length} profile(s).`);
  };

  // Toast notification helper
  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Add Form Submitting & Validations
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Prevent saving if all fields are empty
    const allNull = !formFirstName.trim() && 
                    !formLastName.trim() && 
                    !formCompanyAccess && 
                    !formLoginId.trim() && 
                    !formPassword.trim() && 
                    !formConfirmPassword.trim();
    if (allNull) {
      showToast('error', 'Cannot save user profile because all fields are empty.');
      return;
    }

    // Confirm passwords match
    if (formPassword !== formConfirmPassword) {
      showToast('error', 'Cannot save. Passwords do not match.');
      return;
    }

    const companySelected = formCompanyAccess || 'N/A';

    // Prepare dynamic email from Login ID & Company Access
    const domainText = companySelected.toLowerCase().replace(/[^a-z0-9]/g, '');
    const computedEmail = `${formLoginId.trim().toLowerCase() || 'user'}@${domainText}.com`;
    const generatedId = Date.now().toString();

    // Vince Carter Scenario: name consists of First Name and Last Name
    const fullName = `${formFirstName.trim()} ${formLastName.trim()}`.trim() || 'Unnamed Profile';

    const newProfile = {
      id: generatedId,
      name: fullName,
      company: companySelected,
      email: computedEmail,
      loginId: formLoginId.trim()
    };

    // Add to state and save optimistically
    setProfiles(prev => [...prev, newProfile]);

    try {
      await fetch('/api/user-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newProfile.id,
          firstName: newProfile.name,
          companyName: newProfile.company,
          loginId: newProfile.loginId,
          password: formPassword,
          email: newProfile.email
        })
      });
    } catch (err) {
      console.error('Error persisting user profile to database:', err);
    }

    // Reset Form Fields
    resetForm();

    // Go back to list view
    setView('list');
    showToast('success', `User profile for "${newProfile.name}" has been created successfully.`);
  };

  const resetForm = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormCompanyAccess('');
    setFormLoginId('');
    setFormPassword('');
    setFormConfirmPassword('');
    setShowPassword(false);
  };

  // Filter and sort the list of profiles
  const getFilteredAndSortedProfiles = () => {
    let list = [...profiles];

    // Apply search filters
    if (appliedSearchName.trim()) {
      const sName = appliedSearchName.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(sName));
    }

    if (appliedSearchCompany.trim()) {
      const sCompany = appliedSearchCompany.toLowerCase().trim();
      list = list.filter(p => p.company.toLowerCase().includes(sCompany));
    }

    // Sort alphabetically by Name
    list.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      
      if (sortDirection === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return list;
  };

  const processedList = getFilteredAndSortedProfiles();

  // Search button is disabled if both text fields are empty/null
  const isSearchDisabled = !searchName.trim() && !searchCompany.trim();

  // Save button is disabled if ALL form inputs are empty
  const isFormEmpty = !formFirstName.trim() && 
                      !formLastName.trim() && 
                      !formCompanyAccess && 
                      !formLoginId.trim() && 
                      !formPassword.trim() && 
                      !formConfirmPassword.trim();

  // Determine if confirm password is dirty and doesn't match
  const showPasswordMismatch = formConfirmPassword.length > 0 && formPassword !== formConfirmPassword;

  if (view === 'add') {
    return (
      <div className="flex flex-col gap-4" id="user-profile-add-section">
        
        {/* Dynamic Feedback Banner */}
        {feedback && (
          <div 
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 transform translate-y-0 ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
            id="toast-notification"
          >
            {feedback.type === 'success' ? (
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs font-sans">✓</div>
            ) : (
              <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs font-sans">!</div>
            )}
            <span className="text-xs font-semibold">{feedback.message}</span>
            <button 
              onClick={() => setFeedback(null)} 
              className="text-slate-400 hover:text-slate-600 ml-2"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Uniform Form Header */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-2">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight font-sans">User Profile Configuration</h1>
            <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
              Logged in as: <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono text-xs">{loginUserText}</span>
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setView('list');
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            title="Cancel"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded border border-slate-200 shadow-sm p-6 max-w-2xl">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            
            {/* First Name textfield */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
                placeholder="e.g. John"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-9 transition-shadow"
                id="form-first-name"
              />
            </div>

            {/* Last Name textfield */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
                placeholder="e.g. Carter"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-9 transition-shadow"
                id="form-last-name"
              />
            </div>

            {/* Company and Access dynamic Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Company and Access <span className="text-red-500">*</span>
              </label>
              <select
                value={formCompanyAccess}
                onChange={(e) => {
                  setFormCompanyAccess(e.target.value);
                }}
                required
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-9 transition-shadow cursor-pointer"
                id="form-company-access"
              >
                <option value="">-- Select Company Profile --</option>
                {companies.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name} {c.type ? `(${c.type})` : ''}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Values listed dynamically from active company profiles defined in step 1.</span>
            </div>

            {/* Login ID textfield */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Login ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formLoginId}
                onChange={(e) => setFormLoginId(e.target.value)}
                placeholder="e.g. john.dbs"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-9 transition-shadow"
                id="form-login-id"
              />
            </div>

            {/* Password textfield with toggle view/hide */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 rounded pl-2.5 pr-10 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-9 transition-shadow"
                  id="form-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  id="btn-toggle-password-view"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password with match check */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formConfirmPassword}
                onChange={(e) => setFormConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-white border rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 h-9 transition-all ${
                  showPasswordMismatch
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                id="form-confirm-password"
              />
              {showPasswordMismatch && (
                <p className="text-[11px] text-rose-500 font-bold mt-1.5 bg-rose-50/50 border border-rose-100 p-2 rounded flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-150" id="password-mismatch-note">
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-sans">!</span>
                  <span>Confirm password does not match the password entered above.</span>
                </p>
              )}
            </div>

            {/* Form Actions Footer */}
            <div className="border-t border-slate-200 pt-4 mt-3 flex items-center justify-end gap-2">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView('list');
                }}
                className="px-4 py-2 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded shadow-sm transition-colors uppercase tracking-wider h-9"
                id="btn-cancel-profile"
              >
                Cancel
              </button>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isFormEmpty || showPasswordMismatch}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 disabled:hover:bg-indigo-600 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
                id="btn-save-profile"
                title={isFormEmpty ? "Cannot save profile when form is empty" : showPasswordMismatch ? "Resolve mismatch error first" : "Save user profile"}
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
    <div className="flex flex-col gap-4" id="user-profile-config-container">
      
      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 transform translate-y-0 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
          id="toast-notification"
        >
          {feedback.type === 'success' ? (
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs font-sans">✓</div>
          ) : (
            <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs font-sans">!</div>
          )}
          <span className="text-xs font-semibold">{feedback.message}</span>
          <button 
            onClick={() => setFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Subtitle / Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col gap-1">
        <h2 className="text-sm font-bold text-slate-900 font-sans">User Profile Configuration</h2>
        <p className="text-[11px] text-slate-400">
          Filter and manage system administrator and client-level accounts.
        </p>
      </div>

      {/* ==================== LIST VIEW ==================== */}
      <div className="flex flex-col gap-4" id="user-profile-list-section">
        
        {/* Controls Box: Search, Add, Delete */}
        <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Name TEXT INPUT */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Name</span>
              <input
                type="text"
                placeholder="Enter Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white min-w-[170px] focus:outline-none focus:ring-1 focus:ring-indigo-500 h-8 text-slate-800"
                id="search-input-name"
              />
            </div>

            {/* Company TEXT INPUT */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Company</span>
              <input
                type="text"
                placeholder="Enter Company"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white min-w-[170px] focus:outline-none focus:ring-1 focus:ring-indigo-500 h-8 text-slate-800"
                id="search-input-company"
              />
            </div>

            {/* Search button & Clear */}
            <div className="flex items-end gap-2 h-10 pt-4">
              <button
                onClick={() => {
                  if (!isSearchDisabled) {
                    setAppliedSearchName(searchName);
                    setAppliedSearchCompany(searchCompany);
                  }
                }}
                disabled={isSearchDisabled}
                className={`px-4 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider h-8 ${
                  isSearchDisabled 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm'
                }`}
                id="btn-search-profiles"
                title={isSearchDisabled ? "Enter name or company to search" : "Apply filters"}
              >
                <Search className="w-3 h-3" />
                Search
              </button>
              {(appliedSearchName || appliedSearchCompany || searchName || searchCompany) && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors h-8"
                  id="btn-clear-search-profiles"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 self-end">
            {/* ADD Button */}
            <button
              onClick={() => {
                setView('add');
                resetForm();
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider h-8"
              id="btn-add-profile"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              className={`px-3.5 py-1.5 text-xs font-bold rounded transition-colors flex items-center gap-1.5 uppercase tracking-wider h-8 ${
                selectedIds.size === 0 
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm'
              }`}
              id="btn-delete-profile"
              title={selectedIds.size === 0 ? "Select rows using checkboxes to delete" : `Delete (${selectedIds.size})`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedIds.size})
            </button>
          </div>
        </div>

        {/* Profiles Data Table */}
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden" id="profiles-table-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="user-profiles-table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {/* Checkbox Header */}
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={processedList.length > 0 && selectedIds.size === processedList.length}
                      onChange={() => handleToggleSelectAll(processedList)}
                      disabled={processedList.length === 0}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      id="select-all-checkbox"
                    />
                  </th>
                  <th className="p-3 w-16 text-center">S/No.</th>
                  
                  {/* Sortable Name Column */}
                  <th 
                    className="p-3 cursor-pointer hover:bg-slate-100 select-none transition-colors"
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    id="name-column-header"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      {/* Triangle toggler indicator */}
                      <span 
                        className="inline-block transition-transform duration-200"
                        id="sorting-triangle-indicator"
                      >
                        {sortDirection === 'asc' ? (
                          <span className="text-indigo-600 font-bold text-xs" title="Sorting A to Z (Click to toggle Z to A)">▲</span>
                        ) : (
                          <span className="text-indigo-600 font-bold text-xs" title="Sorting Z to A (Click to toggle A to Z)">▼</span>
                        )}
                      </span>
                    </div>
                  </th>

                  <th className="p-3">Company</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {processedList.length > 0 ? (
                  processedList.map((profile, index) => {
                    const isChecked = selectedIds.has(profile.id);
                    return (
                      <tr 
                        key={profile.id} 
                        className={`hover:bg-slate-50/70 transition-colors ${isChecked ? 'bg-indigo-50/20' : ''}`}
                        id={`profile-row-${profile.id}`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectRow(profile.id)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            id={`row-checkbox-${profile.id}`}
                          />
                        </td>
                        <td className="p-3 text-center font-mono text-slate-400">
                          {index + 1}
                        </td>
                        <td className="p-3 font-semibold text-slate-900">
                          {profile.name}
                        </td>
                        <td className="p-3 text-slate-600">
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
                            {profile.company}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono">
                          {profile.email}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 bg-white">
                      <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2.5" />
                      <span className="font-bold text-slate-700 uppercase text-xs tracking-wider">No User Profiles Found</span>
                      <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search criteria or add a new profile configuration.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>



    </div>
  );
}
