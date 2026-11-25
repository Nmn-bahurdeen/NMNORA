import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, ArrowLeft, AlertTriangle, KeyRound, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@nmnora.com');
  const [password, setPassword] = useState('AdminPassword@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already authenticated as ADMIN, redirect straight to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const performLogin = async (loginEmail, loginPass) => {
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(loginEmail.trim(), String(loginPass).trim());
      if (loggedUser.role !== 'ADMIN') {
        setError(`Access denied. Account "${loggedUser.email}" has CUSTOMER permissions. An ADMIN role is required.`);
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login failed:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to backend server. Please verify port 5000 is online.');
      } else {
        setError('Invalid administrator credentials. Access denied.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleQuickLogin = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    performLogin(fillEmail, fillPass);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl relative z-10">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <ShieldCheck size={28} />
          </div>
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock size={11} /> Restricted Admin Portal
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin & Developer Console</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">Authorized store administrators only.</p>
        </div>

        {/* Notice if currently signed in as Customer */}
        {user && user.role !== 'ADMIN' && (
          <div className="mb-6 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span>Currently signed in as customer (<strong>{user.email}</strong>). Log in below with an administrator account to continue.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-3">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nmnora.com"
              className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Security Key / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono"
            />
          </div>

          {/* Quick 1-Click Instant Login Buttons */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><KeyRound size={13} className="text-amber-400" /> Instant Admin Sign-In:</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('admin@nmnora.com', 'AdminPassword@123')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-colors group cursor-pointer disabled:opacity-50"
              >
                <div className="truncate">
                  <span className="text-amber-400 font-mono text-xs font-bold">admin@nmnora.com</span>
                  <span className="text-slate-400 text-[10px] ml-2">Default Store Admin</span>
                </div>
                <span className="text-[11px] text-amber-400 font-bold uppercase flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Instant Login <ArrowRight size={12} />
                </span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin('230071601103@gmail.com', 'AdminPassword@123')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-left transition-colors group cursor-pointer disabled:opacity-50"
              >
                <div className="truncate">
                  <span className="text-sky-400 font-mono text-xs font-bold">230071601103@gmail.com</span>
                  <span className="text-slate-400 text-[10px] ml-2">Owner (bahur)</span>
                </div>
                <span className="text-[11px] text-sky-400 font-bold uppercase flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Instant Login <ArrowRight size={12} />
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Lock size={15} />
                <span>Enter Admin Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-7 pt-5 border-t border-slate-800 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={13} /> Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
