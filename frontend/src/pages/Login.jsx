import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const { data } = await login(form);
      setAuth(data.user, data.token);
      toast.success(t('common.success'));
      navigate(data.user.role === 'admin' ? '/admin' : '/account');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        toast.error(t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{t('auth.login_title')} | CleanPro</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-charcoal">{t('auth.login_title')}</h1>
            <p className="mt-2 text-gray-500 font-body">{t('auth.login_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
            <Input
              label={t('auth.email')}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email?.[0]}
              required
            />
            <Input
              label={t('auth.password')}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password?.[0]}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              {t('auth.login_button')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 font-body">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-sage font-semibold hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
