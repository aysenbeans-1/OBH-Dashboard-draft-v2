import { useState } from 'react';
import { Smartphone, Send, ShieldCheck, Settings, Plus, List, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export function ManageServices({ typeOverride = 'SMS' }) {
  const [activeTab, setActiveTab] = useState('Register');

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-300 pb-2">
        <div className="flex gap-6">
          <button className="pb-2 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600">
            Service Governance: {typeOverride === 'SMS' ? 'SMS Provider' : 'Push Application'}
          </button>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
            SYSTEM STATUS: ONLINE
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Internal Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('Register')}
              className={cn(
                "px-6 py-2 text-xs font-bold transition-all relative top-[1px]",
                activeTab === 'Register' 
                  ? "border-x border-t border-slate-200 bg-white text-indigo-600" 
                  : "text-slate-500 hover:text-slate-700 font-medium"
              )}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab('Manage')}
              className={cn(
                "px-6 py-2 text-xs font-bold transition-all relative top-[1px]",
                activeTab === 'Manage' 
                  ? "border-x border-t border-slate-200 bg-white text-indigo-600" 
                  : "text-slate-500 hover:text-slate-700 font-medium"
              )}
            >
              Manage
            </button>
            <button
              onClick={() => setActiveTab('Access')}
              className={cn(
                "px-6 py-2 text-xs font-bold transition-all relative top-[1px]",
                activeTab === 'Access' 
                  ? "border-x border-t border-slate-200 bg-white text-indigo-600" 
                  : "text-slate-500 hover:text-slate-700 font-medium"
              )}
            >
              Control Access
            </button>
          </div>

          <div className="flex-1 bg-white rounded border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200">
               {activeTab === 'Register' && <Plus className="w-6 h-6 text-slate-400" />}
               {activeTab === 'Manage' && <Settings className="w-6 h-6 text-slate-400" />}
               {activeTab === 'Access' && <Lock className="w-6 h-6 text-slate-400" />}
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {activeTab} Workflow: {typeOverride}
            </h4>
            <p className="text-xs text-slate-500 mt-2 font-serif italic max-w-sm">
              Registration protocols and data fields for {typeOverride} {activeTab.toLowerCase()} are currently being finalized. Deployment of these nodes will follow security audit.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-8 w-full max-w-lg opacity-40 grayscale">
               <div className="h-1 bg-slate-200 rounded"></div>
               <div className="h-1 bg-slate-200 rounded"></div>
               <div className="h-1 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
