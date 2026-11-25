import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (loginEmail, loginPass) => {
    setError('');
    setLoading(true);

    try {
      const user = await login(loginEmail.trim(), String(loginPass).trim());
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login submit error:', err);
      const serverMsg = err.response?.data?.error;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to server. Please verify backend is running on port 5000.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const fillDemoCustomer = () => {
    setEmail('customer@nmnora.com');
    setPassword('Customer@123');
    handleLogin('customer@nmnora.com', 'Customer@123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 relative overflow-hidden font-sans">
      {/* Decorative ambient gradients */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/80 backdrop-blur-xl relative z-10">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100 shadow-sm">
            <User size={28} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Customer Sign In</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">Access your NMNORA account, view orders, and checkout faster</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3 shadow-xs">
            <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium font-mono"
            />
          </div>

          {/* Quick Demo Customer Sign-in */}
          <div className="pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={fillDemoCustomer}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 text-xs font-semibold text-blue-800 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" />
                <span>Test Demo Customer Account</span>
              </div>
              <span className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                1-Click Login <ArrowRight size={12} />
              </span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Sign In to Store</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-7 pt-5 border-t border-slate-100 text-center space-y-3">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Create an Account
            </Link>
          </p>
          <div className="pt-1">
            <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Store Administrator? Access Admin Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
