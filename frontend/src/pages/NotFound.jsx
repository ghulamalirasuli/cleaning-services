import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import Button from '../components/ui/Button';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet><title>{t('common.not_found')} | CleanPro</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="text-center">
          <h1 className="text-8xl font-display font-bold text-sage mb-4">404</h1>
          <h2 className="text-2xl font-display font-bold text-charcoal mb-2">{t('common.not_found')}</h2>
          <p className="text-gray-500 font-body mb-8">{t('common.not_found_desc')}</p>
          <Link to="/">
            <Button>{t('common.go_home')}</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
