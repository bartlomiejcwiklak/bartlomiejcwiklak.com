import { useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';

type BacklogStatus = 'playing' | 'completed' | 'backlog' | 'dropped' | 'replaying';

type BacklogItem = {
  id: string;
  title: string;
  status: BacklogStatus;
  platforms: string[];
  rating?: number;
  startedAt?: string;
  finishedAt?: string;
  notes?: string;
  metadata: {
    description?: string;
    coverUrl?: string;
    heroUrl?: string;
    releaseDate?: string;
    genres?: string[];
    developers?: string[];
    publishers?: string[];
    steamAppId?: string;
    storeUrl?: string;
    source?: string;
  };
};

type BacklogPayload = {
  updatedAt: string;
  items: BacklogItem[];
};

const statusOrder: BacklogStatus[] = ['playing', 'completed', 'replaying', 'backlog', 'dropped'];

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.45 },
};

function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return null;
  }

  const normalized = value.length === 7 ? `${value}-01` : value;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: value.length >= 7 ? 'long' : undefined,
    day: value.length > 7 ? 'numeric' : undefined,
  }).format(date);
}

const Backlog = () => {
  const { t, i18n } = useTranslation();
  const [payload, setPayload] = useState<BacklogPayload | null>(null);
  const [hasError, setHasError] = useState(false);

  usePageMeta({
    title: 'BACKLOG | Bartlomiej Cwiklak',
    description: t('backlog.description'),
    path: '/backlog',
    lang: i18n.language,
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let active = true;

    const loadBacklog = async () => {
      try {
        const response = await fetch('/backlog.json', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load backlog: ${response.status}`);
        }

        const data = await response.json() as BacklogPayload;

        if (active) {
          setPayload(data);
          setHasError(false);
        }
      } catch {
        if (active) {
          setHasError(true);
        }
      }
    };

    void loadBacklog();

    return () => {
      active = false;
    };
  }, []);

  const items = payload?.items ?? [];
  const groupedItems = statusOrder
    .map((status) => ({
      status,
      items: items.filter((item) => item.status === status),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white text-black"
    >
      <section className="px-6 md:px-12 pt-32 md:pt-44 pb-12 md:pb-16 border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-sans uppercase tracking-[0.22em] opacity-40">
            {t('backlog.eyebrow')}
          </span>
          <h1 className="mt-5 font-display font-black tracking-tighter leading-[0.85] text-[18vw] md:text-[9vw]">
            {t('backlog.title')}
          </h1>
          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] md:items-end">
            <p className="max-w-2xl text-base md:text-xl leading-relaxed opacity-70">
              {t('backlog.description')}
            </p>
            <div className="text-sm font-sans opacity-45 md:text-right">
              {payload ? `${t('backlog.updated')}: ${formatDate(payload.updatedAt, i18n.language)}` : t('backlog.loading')}
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 py-10 md:py-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-14 md:gap-20">
          {!payload && (
            <p className="text-base md:text-lg opacity-60">{t('backlog.loading')}</p>
          )}

          {hasError && (
            <div className="border border-black/10 p-6 md:p-8">
              <p className="max-w-2xl text-base md:text-lg leading-relaxed opacity-70">
                {t('backlog.error')}
              </p>
            </div>
          )}

          {payload && !hasError && groupedItems.length === 0 && (
            <div className="border border-black/10 p-6 md:p-8">
              <p className="max-w-2xl text-base md:text-lg leading-relaxed opacity-70">
                {t('backlog.empty')}
              </p>
            </div>
          )}

          {groupedItems.map((group) => (
            <motion.section key={group.status} {...sectionMotion}>
              <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                <h2 className="font-display font-black text-3xl md:text-5xl tracking-tighter">
                  {t(`backlog.states.${group.status}`)}
                </h2>
                <span className="text-xs md:text-sm font-sans uppercase tracking-[0.18em] opacity-35">
                  {group.items.length}
                </span>
              </div>

              <div className="mt-6 grid gap-8 md:gap-10">
                {group.items.map((item) => {
                  const coverUrl = item.metadata.heroUrl || item.metadata.coverUrl;
                  const releaseDate = formatDate(item.metadata.releaseDate, i18n.language);

                  return (
                    <article key={item.id} className="grid gap-5 border-b border-black/10 pb-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-8">
                      <div className="overflow-hidden bg-black/5 aspect-[16/9]">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs uppercase tracking-[0.22em] opacity-35">
                            {item.title}
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 md:gap-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="font-display font-black text-3xl md:text-5xl leading-[0.9] tracking-tighter">
                              {item.title}
                            </h3>
                            {item.metadata.description && (
                              <p className="mt-3 max-w-3xl text-sm md:text-base leading-relaxed opacity-65">
                                {item.metadata.description}
                              </p>
                            )}
                          </div>

                          {typeof item.rating === 'number' && (
                            <div className="shrink-0 text-left md:text-right">
                              <span className="block text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] opacity-35">
                                {t('backlog.rating')}
                              </span>
                              <span className="font-display text-4xl md:text-5xl leading-none">
                                {item.rating}/10
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-3 text-sm md:grid-cols-2 md:gap-x-8 md:gap-y-4">
                          {releaseDate && (
                            <div>
                              <span className="block text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] opacity-35">
                                {t('backlog.released')}
                              </span>
                              <span>{releaseDate}</span>
                            </div>
                          )}

                          {item.platforms.length > 0 && (
                            <div>
                              <span className="block text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] opacity-35">
                                {t('backlog.platforms')}
                              </span>
                              <span>{item.platforms.join(', ')}</span>
                            </div>
                          )}

                          {item.metadata.genres && item.metadata.genres.length > 0 && (
                            <div>
                              <span className="block text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] opacity-35">
                                {t('backlog.genres')}
                              </span>
                              <span>{item.metadata.genres.join(', ')}</span>
                            </div>
                          )}

                          {item.metadata.developers && item.metadata.developers.length > 0 && (
                            <div>
                              <span className="block text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] opacity-35">
                                {t('backlog.developers')}
                              </span>
                              <span>{item.metadata.developers.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <div className="border-t border-black/10 pt-4">
                            <span className="block text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] opacity-35">
                              {t('backlog.notes')}
                            </span>
                            <p className="mt-2 max-w-3xl text-sm md:text-base leading-relaxed opacity-70">
                              {item.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Backlog;
