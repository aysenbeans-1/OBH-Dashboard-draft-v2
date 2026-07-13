import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, User, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const { tenantId: pathTenantId } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [tenantId, setTenantId] = useState(pathTenantId || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbInfo, setDbInfo] = useState({ connected: false, mode: 'Diagnostic hook active...' });

  useEffect(() => {
    fetch('/api/db/status')
      .then((res) => res.json())
      .then((data) => setDbInfo({ connected: data.connected, mode: data.mode }))
      .catch(() => setDbInfo({ connected: false, mode: 'Diagnostics failed to query node' }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role,
          tenantId: role === 'customer' ? tenantId : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Access authorization verification failed.');
      }

      onLogin(data.user);
      if (role === 'admin') {
        navigate('/admin/numbers');
      } else {
        navigate(`/${data.user.tenantId || 'default'}/dashboard/reports`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl shadow-slate-200/50 p-8 border border-slate-200 animate-in fade-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center mb-4 shadow-lg animate-bounce">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">OBH Dashboard</h1>
          <p className="text-[11px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Authentication Required</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-xs font-semibold leading-relaxed animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              disabled={loading}
              onClick={() => setRole('admin')}
              className={cn(
                "py-1.5 px-3 rounded text-[10px] font-bold transition-all disabled:opacity-50",
                role === 'admin' ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
            >
              ADMIN
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setRole('customer')}
              className={cn(
                "py-1.5 px-3 rounded text-[10px] font-bold transition-all disabled:opacity-50",
                role === 'customer' ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
              )}
            >
              CUSTOMER
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                disabled={loading}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 disabled:opacity-50"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 disabled:opacity-50"
                required
              />
            </div>

            {role === 'customer' && (
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={tenantId}
                  disabled={loading}
                  onChange={(e) => setTenantId(e.target.value)}
                  placeholder="Tenant ID (e.g. dbs)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 disabled:opacity-50"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded text-xs font-bold tracking-widest uppercase hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center cursor-pointer"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        {/*
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-1.5 bg-slate-50 p-2 rounded border border-slate-100 text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              dbInfo.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-400 animate-pulse"
            )} />
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Database: {dbInfo.connected ? 'Active SQL Pool' : 'Simulated Sandbox'}</span>
          </div>
          <span className="text-[9px] font-mono text-slate-400/80 leading-none break-all">{dbInfo.mode}</span>
        </div>
        */}
      </div>
    </div>
  );
}
