import { useState } from 'react';
import { Plus, Trash2, Edit2, ShieldAlert, FileText, Settings, Smartphone, CheckCircle, Search, Filter, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('whitelist');
  const [whitelistSubTab, setWhitelistSubTab] = useState('numbers');
  const [editSubTab, setEditSubTab] = useState('identities');
  
  // State for Manage Numbers
  const [destNumbers, setDestNumbers] = useState([]);
  const [senderIds, setSenderIds] = useState([]);
  const [rules, setRules] = useState([]);
  
  // Form States
  const [newNumber, setNewNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+65');
  const [newSenderId, setNewSenderId] = useState('');
  const [selectedRule, setSelectedRule] = useState('Priority');

  const addNumber = () => {
    if (!newNumber) return;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      number: newNumber,
      countryCode,
      status: 'active',
      addedAt: new Date().toISOString(),
    };
    setDestNumbers([...destNumbers, item]);
    setNewNumber('');
  };

  const addSenderId = () => {
    if (!newSenderId) return;
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      value: newSenderId,
      status: 'active',
      addedAt: new Date().toISOString(),
    };
    setSenderIds([...senderIds, item]);
    setNewSenderId('');
  };

  const setRule = () => {
    const rule = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedRule,
      createdAt: new Date().toISOString(),
    };
    setRules([...rules, rule]);
  };

  const deleteNumber = (id) => setDestNumbers(destNumbers.filter(n => n.id !== id));
  const deleteSenderId = (id) => setSenderIds(senderIds.filter(s => s.id !== id));

  const toggleBlockNumber = (id) => {
    setDestNumbers(destNumbers.map(n => n.id === id ? { ...n, status: n.status === 'active' ? 'blocked' : 'active' } : n));
  };

  const toggleBlockSender = (id) => {
    setSenderIds(senderIds.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'blocked' : 'active' } : s));
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-300">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('whitelist')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeTab === 'whitelist' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Whitelist
          </button>
          <button
            onClick={() => setActiveTab('edit-generate')}
            className={cn(
              "pb-2 text-sm font-bold border-b-2 transition-all",
              activeTab === 'edit-generate' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Edit and Generate
          </button>
        </div>
        <div className="mb-2">
          <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 transition-colors">
            GENERATE REPORT
          </button>
        </div>
      </div>

      {activeTab === 'whitelist' ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-rows-2 gap-4">
            {/* 1st Container: Destination Numbers */}
            <div className="bg-white rounded border border-slate-200 p-3 shadow-sm flex flex-col gap-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">1. Destination Numbers</h3>
              <div className="flex gap-2">
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-2 py-1.5 text-xs border border-slate-300 rounded bg-slate-50 focus:outline-none"
                >
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+60">🇲🇾 +60</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter Number"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  onClick={addNumber}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded font-medium hover:bg-slate-700 transition-colors"
                >
                  ADD
                </button>
              </div>
            </div>

            {/* 2nd Container: Sender ID */}
            <div className="bg-white rounded border border-slate-200 p-3 shadow-sm flex flex-col gap-2">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">2. Sender ID</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Sender ID (e.g. DBS_OTP)"
                  value={newSenderId}
                  onChange={(e) => setNewSenderId(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  onClick={addSenderId}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded font-medium hover:bg-slate-700 transition-colors"
                >
                  ADD
                </button>
              </div>
            </div>
          </div>

          {/* 3rd Container: Rules */}
          <div className="bg-white rounded border border-slate-200 p-3 shadow-sm flex flex-col gap-3">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">3. User Defined Rules</h3>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] text-slate-400 font-semibold">Select Rule Type</label>
              <select 
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
                className="w-full px-2 py-2 text-xs border border-slate-300 rounded bg-white"
              >
                <option value="Priority">Priority Queue (High)</option>
                <option value="Block">Block High Frequency</option>
                <option value="Route">Adaptive Routing</option>
                <option value="Rate Limit">Rate Limit (Global)</option>
              </select>
              <button 
                onClick={setRule}
                className="w-full py-2 bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors"
              >
                SET ACTIVE RULE
              </button>
              <div className="mt-2 p-2 bg-indigo-50 rounded border border-indigo-100">
                <p className="text-[10px] text-indigo-700 leading-relaxed text-center">
                  <strong>Active Status:</strong> {selectedRule} is currently being applied to all incoming packets for valid routing nodes.
                </p>
              </div>
            </div>
          </div>

          {/* 4th Container: Lists */}
          <div className="col-span-2 bg-white rounded border border-slate-200 shadow-sm flex flex-col">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setWhitelistSubTab('numbers')}
                className={cn(
                  "px-4 py-2 text-xs font-bold border-r border-slate-200 transition-colors",
                  whitelistSubTab === 'numbers' ? "bg-slate-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                Destination Number List
              </button>
              <button 
                onClick={() => setWhitelistSubTab('senders')}
                className={cn(
                  "px-4 py-2 text-xs font-bold border-r border-slate-200 transition-colors",
                  whitelistSubTab === 'senders' ? "bg-slate-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                Sender ID List
              </button>
              <div className="ml-auto flex items-center px-4 text-[10px] text-slate-400 font-mono">
                Total Objects: {whitelistSubTab === 'numbers' ? destNumbers.length : senderIds.length}
              </div>
            </div>
            <div className="p-0 overflow-auto max-h-64 scrollbar-hide">
              <table className="w-full text-left text-[11px] border-collapse relative">
                <thead className="sticky top-0 bg-white border-b border-slate-200 z-[1]">
                  <tr className="text-left text-slate-400 uppercase">
                    <th className="p-2 font-semibold">ID</th>
                    <th className="p-2 font-semibold">{whitelistSubTab === 'numbers' ? 'Identity' : 'Sender Value'}</th>
                    <th className="p-2 font-semibold">Timestamp</th>
                    <th className="p-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {whitelistSubTab === 'numbers' ? (
                    destNumbers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 italic">No whitelisted records found in current node.</td>
                      </tr>
                    ) : (
                      destNumbers.map((num, idx) => (
                        <tr key={num.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-mono text-slate-400">#{1024 + idx}</td>
                          <td className="p-2 font-bold text-[#141414]">{num.countryCode} {num.number}</td>
                          <td className="p-2 text-slate-500 font-mono">{new Date(num.addedAt).toISOString().split('T')[0]}</td>
                          <td className="p-2 text-right">
                            <button 
                              onClick={() => deleteNumber(num.id)}
                              className="text-red-500 hover:text-red-700 font-bold px-2 text-[10px]"
                            >
                              DELETE
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    senderIds.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 italic">No sender IDs configured yet.</td>
                      </tr>
                    ) : (
                      senderIds.map((sid, idx) => (
                        <tr key={sid.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 font-mono text-slate-400">#{2048 + idx}</td>
                          <td className="p-2 font-bold text-[#141414]">{sid.value}</td>
                          <td className="p-2 text-slate-500 font-mono">{new Date(sid.addedAt).toISOString().split('T')[0]}</td>
                          <td className="p-2 text-right">
                            <button 
                              onClick={() => deleteSenderId(sid.id)}
                              className="text-red-500 hover:text-red-700 font-bold px-2 text-[10px]"
                            >
                              DELETE
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Edit and Generate View */
        <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col flex-1">
          <div className="p-2 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
             <div className="flex gap-2">
                <button 
                  onClick={() => setEditSubTab('identities')}
                  className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold transition-all shadow-sm border",
                    editSubTab === 'identities' ? "bg-white border-slate-200 text-indigo-600" : "bg-transparent border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  Identity View
                </button>
                <button 
                  onClick={() => setEditSubTab('senders')}
                  className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold transition-all shadow-sm border",
                    editSubTab === 'senders' ? "bg-white border-slate-200 text-indigo-600" : "bg-transparent border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  Sender View
                </button>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                   <input type="text" placeholder={`Search ${editSubTab}...`} className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] w-48 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>
          <div className="p-0 overflow-auto scrollbar-hide flex-1">
             <table className="w-full text-left text-[11px] border-collapse relative">
               <thead className="sticky top-0 bg-white border-b border-slate-200 z-[1]">
                  <tr className="text-left text-slate-400 uppercase">
                    <th className="p-2 font-semibold">{editSubTab === 'identities' ? 'Identity' : 'Sender ID'}</th>
                    <th className="p-2 font-semibold">Status</th>
                    <th className="p-2 font-semibold">System Tag</th>
                    <th className="p-2 font-semibold text-right">Governance</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {editSubTab === 'identities' ? (
                    destNumbers.map((num) => (
                      <tr key={num.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-2 font-mono font-bold text-[#141414]">{num.countryCode} {num.number}</td>
                        <td className="p-2">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter",
                            num.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {num.status}
                          </span>
                        </td>
                        <td className="p-2 text-slate-400 text-[10px] italic">Verified_Node_01</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button 
                              onClick={() => toggleBlockNumber(num.id)}
                              className="text-[10px] font-black px-2 py-0.5 rounded transition-colors hover:bg-slate-100"
                            >
                              {num.status === 'active' ? 'BLOCK' : 'ALLOW'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    senderIds.map((sid) => (
                      <tr key={sid.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-2 font-mono font-bold text-[#141414]">{sid.value}</td>
                        <td className="p-2">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tighter",
                            sid.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {sid.status}
                          </span>
                        </td>
                        <td className="p-2 text-slate-400 text-[10px] italic">Verified_Sender_01</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button 
                              onClick={() => toggleBlockSender(sid.id)}
                              className="text-[10px] font-black px-2 py-0.5 rounded transition-colors hover:bg-slate-100"
                            >
                              {sid.status === 'active' ? 'BLOCK' : 'ALLOW'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {((editSubTab === 'identities' && destNumbers.length === 0) || (editSubTab === 'senders' && senderIds.length === 0)) && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-300 font-serif italic text-sm">Deployment sequence awaiting local records...</td>
                    </tr>
                  )}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
}
