import { useState } from 'react';
import { Calendar, Download, Filter, Search, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [reports, setReports] = useState([]);

  const generateReport = () => {
    // Mock generating reports
    const mockReports = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      date: `${selectedMonth} ${Math.floor(Math.random() * 28) + 1}, ${selectedYear}`,
      destinationNumber: `+65 8292 ${1000 + i}`,
      senderId: 'OTP_VERIFY',
      status: ['Delivered', 'Failed', 'Pending'][Math.floor(Math.random() * 3)],
    }));
    setReports(mockReports);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex gap-6">
          <button className="pb-2 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600">Reporting Log</button>
        </div>
        <div>
          <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 transition-colors">
            GENERATE REPORT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Container 1: Filters */}
        <section className="bg-white p-4 rounded border border-slate-200 shadow-sm">
          <div className="flex items-end gap-4">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Month</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Year</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>
            </div>
            <button 
              onClick={generateReport}
              className="px-6 py-2 bg-slate-800 text-white text-xs rounded font-bold hover:bg-slate-700 transition-colors"
            >
              GENERATE
            </button>
          </div>
        </section>

        {/* Container 2: Result List */}
        <section className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
          <div className="p-2 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-2 px-2">
                <FileText className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Audit Log</span>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                   <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                   <input type="text" placeholder="Search identities..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] w-48 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
                <button className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                  <Download className="w-3 h-3" />
                </button>
             </div>
          </div>
          <div className="p-0 overflow-auto scrollbar-hide max-h-[500px]">
             <table className="w-full text-left text-[11px] border-collapse relative">
               <thead className="sticky top-0 bg-white border-b border-slate-200 z-[1]">
                  <tr className="text-left text-slate-400 uppercase">
                    <th className="p-2 font-semibold">Activity Date</th>
                    <th className="p-2 font-semibold">Identity</th>
                    <th className="p-2 font-semibold">Origin</th>
                    <th className="p-2 font-semibold text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center opacity-30">
                          <FileText className="w-10 h-10 text-slate-400 mb-2" />
                          <p className="text-xs italic font-serif">Awaiting generation sequence...</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-2 text-slate-500 font-mono tracking-tighter">{entry.date}</td>
                        <td className="p-2 font-bold text-slate-900">{entry.destinationNumber}</td>
                        <td className="p-2 text-slate-400 font-mono">{entry.senderId}</td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                             {entry.status === 'Delivered' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                             {entry.status === 'Failed' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />}
                             {entry.status === 'Pending' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />}
                             <span className={cn(
                               "text-[10px] font-black uppercase tracking-tighter",
                               entry.status === 'Delivered' ? "text-emerald-600" : 
                               entry.status === 'Failed' ? "text-red-600" : "text-amber-600"
                             )}>
                               {entry.status}
                             </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
             </table>
          </div>
        </section>
      </div>
    </div>
  );
}
