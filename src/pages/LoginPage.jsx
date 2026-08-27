import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import {
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInDemoAdmin } = useAuth();
  const { t } = useLanguage();
  const { success, error: showToastError } = useToast();

  const [email, setEmail] = useState('admin@tuiblue.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await signIn(email, password);
      success(t('loginSuccess'));
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || t('loginError');
      setErrorMsg(msg);
      showToastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    try {
      signInDemoAdmin('admin@tuiblue.com');
      success(t('loginSuccess'));
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-[#161f30] border border-slate-800 hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('guestMenu')}</span>
        </Link>

        <LanguageSwitcher variant="dropdown" />
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-[#161f30]/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-md animate-scale-up space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#131b2a] border border-amber-500/30 flex items-center justify-center p-2.5 mx-auto shadow-amber-glow">
              <img src="/src/assets/logo.svg" alt="TUI Blue Logo" className="w-full h-full" />
            </div>
            <h2 className="font-outfit font-extrabold text-2xl text-white">
              {t('adminLoginTitle')}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {t('adminLoginSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-950/50 border border-rose-800/70 rounded-xl text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={t('emailLabel')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tuiblue.com"
              icon={Mail}
              required
            />

            <Input
              label={t('passwordLabel')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={KeyRound}
            >
              {t('signInButton')}
            </Button>
          </form>

          {/* Demo Admin Instant Access Mode */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Instant Verification
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
              onClick={handleDemoLogin}
              icon={Sparkles}
            >
              {t('demoAdminButton')}
            </Button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              {t('demoAdminNote')}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 z-10">
        TUI BLUE Sensatori • Secure Admin Suite
      </footer>
    </div>
  );
}
