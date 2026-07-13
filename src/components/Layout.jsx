import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Smartphone, Settings, ShieldCheck, LogOut, MessageSquareCode, ListChecks, Building } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenu = [
    { name: 'Manage Numbers', path: '/admin/numbers', icon: MessageSquareCode },
    { 
      name: 'Manage Service', 
      path: '/admin/service', 
      icon: Settings,
      children: [
        { name: 'SMS Provider', path: '/admin/service/sms' },
        { name: 'Push Application', path: '/admin/service/push' },
      ]
    },
    { name: 'OTP Deliveries', path: '/admin/deliveries', icon: ListChecks },
    { 
      name: 'Manage Tenant', 
      path: '/admin/tenant', 
      icon: Building,
      children: [
        { name: 'Tenant Configuration', path: '/admin/tenant/config' },
        { name: 'User Profile Configuration', path: '/admin/tenant/profile' },
      ]
    },
  ];

  const customerMenu = [
    { name: 'Reports', path: `/${user.tenantId}/dashboard/reports`, icon: FileText },
    { name: 'Dashboard', path: `/${user.tenantId}/dashboard/stats`, icon: LayoutDashboard },
    { name: 'OTP Device', path: `/${user.tenantId}/dashboard/device`, icon: Smartphone },
  ];

  const menu = user.role === 'admin' ? adminMenu : customerMenu;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-semibold tracking-tight text-sm">
              OBH Dashboard {user.tenantId && <span className="text-slate-400 font-normal ml-1">/{user.tenantId}</span>}
            </span>
          </div>
          <nav className="flex gap-1 ml-6 h-8 items-center bg-slate-50 p-1 rounded-lg border border-slate-100">
            <div className="px-3 py-1 text-[10px] font-bold bg-white text-indigo-600 rounded shadow-sm border border-slate-200">
              {user.role === 'admin' ? 'ADMIN PORTAL' : 'CUSTOMER VIEW'}
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{user.role}</span>
          <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 border-r border-slate-200 bg-slate-50 flex flex-col p-3 gap-1 shadow-[inset_-1px_0_0_0_rgb(0,0,0,0.02)]">
          <div className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-2 tracking-wider">Navigation</div>
          <nav className="flex flex-col gap-1">
            {menu.map((item) => {
              const hasChildren = !!item.children;
              const isPathActive = location.pathname.startsWith(item.path);
              
              return (
                <div key={item.name} className="flex flex-col gap-1">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors",
                        (isActive || (hasChildren && isPathActive))
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                          : "text-slate-600 hover:bg-slate-200"
                      )
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                  
                  {hasChildren && isPathActive && item.children && (
                    <div className="flex flex-col gap-1 ml-6 mt-1 border-l-2 border-slate-200 pl-2">
                       {item.children.map(child => (
                         <NavLink
                          key={child.name}
                          to={child.path}
                          className={({ isActive }) =>
                            cn(
                              "text-[11px] font-bold py-1 px-2 rounded transition-all",
                              isActive
                                ? "text-indigo-600 bg-indigo-50/50"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            )
                          }
                         >
                           {child.name.toUpperCase()}
                         </NavLink>
                       ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
               <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Session Info</div>
               <div className="text-[10.5px] text-slate-500 leading-tight italic truncate">
                Active for: {user.username}
               </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2 px-2 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Account</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 bg-slate-100 overflow-y-auto overflow-x-hidden scrollbar-hide gap-4">
           {children}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-8 bg-slate-800 text-slate-400 flex items-center justify-between px-4 text-[10px] shrink-0">
        <div className="flex gap-4">
          <span>Node Status: <span className="text-emerald-400 font-bold">Healthy</span></span>
          {user.tenantId && <span>Customer Context: /{user.tenantId}</span>}
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-50">v2.1.0-STABLE</span>
          <span>© 2024 OTP Management Console</span>
        </div>
      </footer>
    </div>
  );
}
