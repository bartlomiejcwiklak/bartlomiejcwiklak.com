import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFound = () => {
  const { t, i18n } = useTranslation();

  usePageMeta({
    title: i18n.language === 'pl' ? '404 | Bartlomiej Cwiklak' : '404 | Bartlomiej Cwiklak',
    description: i18n.language === 'pl'
      ? 'Nie znaleziono strony, której szukasz.'
      : 'The page you are looking for could not be found.',
    path: '/404',
    lang: i18n.language,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center px-6 text-white"
    >
      <div className="max-w-xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] opacity-40">404</p>
        <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
          {t('notFound.title')}
        </h1>
        <p className="mt-6 text-sm md:text-base opacity-65">
          {t('notFound.description')}
        </p>
        <Link
          to="/"
          className="mt-8 inline-block border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white hover:text-black transition-colors"
        >
          {t('notFound.cta')}
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
