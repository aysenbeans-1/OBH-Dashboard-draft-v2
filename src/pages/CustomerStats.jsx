import { useState, useEffect } from 'react';
import { 
  Server, Activity, ShieldAlert, BarChart3, Gauge, 
  Bell, Key, Search, ChevronLeft, ChevronRight, 
  CheckCircle2, XCircle, Clock, Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export function CustomerStats() {
  const [activeTab, setActiveTab] = useState('Servers');

  // 1. Servers State
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const servers = [
    { name: 'App Server 1', status: 'online', baseUptime: 45230 },
    { name: 'DB Server 1', status: 'online', baseUptime: 125000 },
    { name: 'DB Server 2', status: 'online', baseUptime: 89000 },
    { name: 'DB Server 3', status: 'offline', baseUptime: 0 },
  ];

  // 3. Blocked Numbers State
  const [blockedPage, setBlockedPage] = useState(1);
  const blockedPerPage = 10;
  const mockBlocked = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    number: `+65 8${Math.floor(Math.random() * 9)}92 ${1000 + i}`,
    account: 'Primary_Node',
    reason: i % 3 === 0 ? 'Spam Detected' : i % 3 === 1 ? 'Rate Limit Cluster' : 'Blacklisted',
    timestamp: '2024-04-23 10:22:15'
  }));
  const totalBlockedPages = Math.ceil(mockBlocked.length / blockedPerPage);
  const currentBlocked = mockBlocked.slice((blockedPage - 1) * blockedPerPage, blockedPage * blockedPerPage);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide no-scrollbar items-center">
          {[
            { id: 'Servers', icon: Server, label: 'Servers' },
            { id: 'TransmissionRate', icon: Activity, label: 'Rate' },
            { id: 'BlockedNumbers', icon: ShieldAlert, label: 'Blocked' },
            { id: 'Performance', icon: Gauge, label: 'Health' },
            { id: 'Usage', icon: BarChart3, label: 'Usage' },
            { id: 'Alerts', icon: Bell, label: 'Alerts' },
            { id: 'API', icon: Key, label: 'API' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-sm font-bold text-xs" 
                  : "text-slate-500 hover:bg-white hover:text-slate-700 text-xs font-medium"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'Servers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servers.map((s) => (
              <div key={s.name} className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{s.name}</span>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    s.status === 'online' ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  )} />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xl font-mono font-bold transition-colors",
                    s.status === 'online' ? "text-slate-800" : "text-slate-300"
                  )}>
                    {s.status === 'online' ? formatUptime(s.baseUptime + uptime) : '00:00:00'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Duration {s.status}</span>
                </div>
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] text-slate-400">Node: SG-WEST-1</span>
                   <button className="text-[9px] font-black text-indigo-600 uppercase hover:underline">Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TransmissionRate' && (
          <div className="bg-white p-12 rounded border border-slate-200 border-dashed text-center opacity-50">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-slate-800">Transmission Rate Visualization</h3>
            <p className="text-xs text-slate-500 mt-1 font-serif italic">Real-time throughput metrics are currently being calibrated for this node.</p>
          </div>
        )}

        {activeTab === 'BlockedNumbers' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-900 leading-none">{mockBlocked.length}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">Total Blocked Identities</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Filter blocked numbers..." className="bg-transparent border-none outline-none text-[10px] w-64" />
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">Page {blockedPage} of {totalBlockedPages}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setBlockedPage(p => Math.max(1, p - 1))}
                        disabled={blockedPage === 1}
                        className="p-1 disabled:opacity-30 hover:bg-slate-200 rounded transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setBlockedPage(p => Math.min(totalBlockedPages, p + 1))}
                        disabled={blockedPage === totalBlockedPages}
                        className="p-1 disabled:opacity-30 hover:bg-slate-200 rounded transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
              </div>
              <table className="w-full text-left text-[11px] border-collapse relative">
                 <thead className="bg-white border-b border-slate-200">
                    <tr className="text-slate-400 font-bold uppercase">
                      <th className="p-3">Phone Number</th>
                      <th className="p-3">Account Node</th>
                      <th className="p-3">Incidient Reason</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {currentBlocked.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900 font-mono tracking-tighter">{item.number}</td>
                        <td className="p-3 text-slate-500">{item.account}</td>
                        <td className="p-3 uppercase">
                          <span className="px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600 text-[9px] font-black border border-red-100">{item.reason}</span>
                        </td>
                        <td className="p-3 text-right text-slate-400 font-mono">{item.timestamp}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Performance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { label: 'Latency (Avg)', value: '12ms', sub: 'Last 10m', icon: Clock, color: 'text-indigo-600' },
               { label: 'Response Time', value: '45ms', sub: '95th Percentile', icon: Gauge, color: 'text-indigo-600' },
               { label: 'Error Rate', value: '0.04%', sub: 'Global Cluster', icon: XCircle, color: 'text-red-500' },
             ].map((m) => (
               <div key={m.label} className="bg-white p-6 rounded border border-slate-200 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{m.label}</span>
                    <m.icon className={cn("w-4 h-4", m.color)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{m.value}</span>
                    <span className="text-[10px] text-slate-400">{m.sub}</span>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'Usage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* SMS Usage */}
             <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
                <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">SMS Protocol Usage</span>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Sent</span>
                      <span className="text-xl font-black text-slate-800">4,230</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Delivered</span>
                      <span className="text-xl font-black text-emerald-600">4,198</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Failed</span>
                      <span className="text-xl font-black text-red-600">32</span>
                   </div>
                </div>
             </div>
             {/* PushApp Usage */}
             <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
                <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">PushApp Protocol Usage</span>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Sent</span>
                      <span className="text-xl font-black text-slate-800">12,890</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Delivered</span>
                      <span className="text-xl font-black text-emerald-600">12,850</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Failed</span>
                      <span className="text-xl font-black text-red-600">40</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Alerts' && (
          <div className="max-w-2xl bg-white rounded border border-slate-200 shadow-sm flex flex-col">
             <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase">Alert Configuration</span>
                </div>
             </div>
             <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <XCircle className="w-5 h-5 text-red-500" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800">System Failures</label>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Receive critical notifications when gateway nodes or authentication clusters offline.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5 text-amber-500" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800">Unusual Activities</label>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">AI-driven detection of anomalous OTP request patterns from specific IP ranges or User-Agents.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-indigo-500" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-800">Threshold Breaches</label>
                        <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Alert when delivery failure rates exceed 5% or latency exceeds 500ms for more than 5 minutes.</p>
                   </div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-end">
                   <button className="px-6 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 transition-colors">UPDATE PROTOCOL</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'API' && (
          <div className="bg-white p-12 rounded border border-slate-200 border-dashed text-center opacity-50">
            <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-slate-800">Access Key & API Management</h3>
            <p className="text-xs text-slate-500 mt-1 font-serif italic">Documentation and credential rotation modules are currently undergoing security verification.</p>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="bg-indigo-50 border border-indigo-100 p-2 rounded flex items-center gap-3">
        <Info className="w-3.5 h-3.5 text-indigo-500" />
        <p className="text-[10px] text-indigo-600 font-medium tracking-tight">
          Cluster data is synchronized every 15s. Metrics reflect global delivery node status for the current session.
        </p>
      </div>
    </div>
  );
}
