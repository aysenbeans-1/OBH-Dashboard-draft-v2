import { useState } from 'react';
import { Search, Download, Filter, ListChecks, Plus, Trash2, ShieldCheck, Zap, Globe, MessageSquare, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export function OTPDeliveries() {
  const [channels, setChannels] = useState({
    sms: true,
    push: true,
    inhouse: false
  });

  const [rules, setRules] = useState([
    { id: '1', primary: 'SMS', fallback: 'Push App', status: 'active' },
    { id: '2', primary: 'Push App', fallback: 'SMS', status: 'active' }
  ]);

  const [primaryChannel, setPrimaryChannel] = useState('SMS');
  const [fallbackChannel, setFallbackChannel] = useState('Push App');

  const addRule = () => {
    if (primaryChannel === fallbackChannel) return;
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      primary: primaryChannel,
      fallback: fallbackChannel,
      status: 'active'
    };
    setRules([...rules, newRule]);
  };

  const deleteRule = (id) => setRules(rules.filter(r => r.id !== id));

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex gap-6">
          <button className="pb-2 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600">
            OTP Delivery Governance
          </button>
        </div>
        <div>
          <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download className="w-3 h-3" />
            EXPORT CONFIG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Preferred communication channels */}
        <section className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">1. Preferred Communication Channels</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
            Select the active gateways authorized for global OTP transmission. Disabling a channel will immediately suspend all associated delivery nodes.
          </p>
          <div className="space-y-2 mt-2">
            <label className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors group">
              <input 
                type="checkbox" 
                checked={channels.sms}
                onChange={(e) => setChannels({...channels, sms: e.target.checked})}
                className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">Enable SMS Gateway</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Standard Cellular Protocol</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors group">
              <input 
                type="checkbox" 
                checked={channels.push}
                onChange={(e) => setChannels({...channels, push: e.target.checked})}
                className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">Enable Push Application</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Firebase Cloud Messaging</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors group">
              <input 
                type="checkbox" 
                checked={channels.inhouse}
                onChange={(e) => setChannels({...channels, inhouse: e.target.checked})}
                className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">Enable In-house App</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">Internal Secure SDK</span>
              </div>
            </label>
          </div>
        </section>

        {/* 2. Multichannel Delivery Rules */}
        <section className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">2. Multichannel Delivery Rules</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Primary Channel</label>
              <select 
                value={primaryChannel}
                onChange={(e) => setPrimaryChannel(e.target.value)}
                className="w-full px-2 py-2 text-xs border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="SMS">SMS</option>
                <option value="Push App">Push App</option>
                <option value="In-house App">In-house App</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Fallback Channel</label>
              <select 
                value={fallbackChannel}
                onChange={(e) => setFallbackChannel(e.target.value)}
                className="w-full px-2 py-2 text-xs border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="SMS">SMS</option>
                <option value="Push App">Push App</option>
                <option value="In-house App">In-house App</option>
              </select>
            </div>
          </div>
          <button 
            onClick={addRule}
            className="w-full mt-2 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            ADD DELIVERY RULE
          </button>
          <div className="p-2 bg-amber-50 rounded border border-amber-100 mt-auto">
            <p className="text-[9px] text-amber-700 leading-relaxed text-center font-medium">
              Rules are evaluated sequentially. A fallback is triggered if the primary node acknowledgment fails within the defined 30s timeout window.
            </p>
          </div>
        </section>

        {/* 3. Current Delivery rules */}
        <section className="col-span-1 md:col-span-2 bg-white rounded border border-slate-200 shadow-sm flex flex-col">
          <div className="p-2 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 px-4">
             <div className="flex items-center gap-2">
                <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">3. Current Active Delivery Chain</span>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                   <input type="text" placeholder="Search rules..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] w-48 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                </div>
             </div>
          </div>
          <div className="p-0 overflow-auto scrollbar-hide">
             <table className="w-full text-left text-[11px] border-collapse relative">
               <thead className="sticky top-0 bg-white border-b border-slate-200 z-[1]">
                  <tr className="text-left text-slate-400 uppercase">
                    <th className="p-3 font-semibold w-12">REF</th>
                    <th className="p-3 font-semibold">Primary Gateway</th>
                    <th className="p-3 font-semibold">Failover Node</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-300 font-serif italic text-sm">No delivery rules found. System defaulting to raw SMS relay.</td>
                    </tr>
                  ) : (
                    rules.map((rule, idx) => (
                      <tr key={rule.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-3 font-mono text-slate-400 text-[10px]">#{100 + idx}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                            <span className="font-bold text-slate-900 uppercase tracking-tight">Active: {rule.primary}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-slate-500 uppercase text-[10px]">{rule.fallback}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tight border border-emerald-100">DEPLOYED</span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => deleteRule(rule.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
             </table>
          </div>
          <div className="p-2 border-t border-slate-100 bg-slate-50 bg-opacity-50 flex justify-center">
             <p className="text-[9px] text-slate-300 uppercase tracking-[0.2em] font-bold">Encrypted Governance Node / Delivery Protocol v4.0</p>
          </div>
        </section>
      </div>
    </div>
  );
}
