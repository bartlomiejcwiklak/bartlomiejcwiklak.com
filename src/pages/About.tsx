import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const EMAIL = "contact@bartlomiejcwiklak.com";
const LINKEDIN = "https://www.linkedin.com/in/bartlomiejcwiklak/";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const About = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 w-full h-[100dvh] bg-[var(--bg-color)] transition-colors duration-800 text-white pt-32 md:pt-48 pb-24 md:pb-16 px-6 md:px-12 z-[60] overflow-y-auto overscroll-y-contain"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="w-full max-w-6xl mx-auto mt-10 md:mt-16">
        <div className="flex flex-col md:flex-row md:gap-20 lg:gap-32">

          {/* Left: lead + paragraphs */}
          <div className="flex-1 min-w-0">
            <motion.p
              {...fadeUp(0.1)}
              className="text-2xl md:text-3xl font-bold leading-snug mb-8 md:mb-10"
            >
              {t('about.lead')}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
              }}
              className="space-y-5 text-sm md:text-base leading-relaxed opacity-65 max-w-xl"
            >
              {(['p1', 'p2', 'p3'] as const).map((key) => (
                <motion.p
                  key={key}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                  }}
                >
                  {t(`about.${key}`)}
                </motion.p>
              ))}
            </motion.div>
          </div>

          {/* Right: contact + availability */}
          <motion.div
            {...fadeUp(0.3)}
            className="mt-12 md:mt-0 shrink-0 md:w-64 flex flex-col gap-7 text-sm"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-40 mb-2">{t('about.availability')}</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                <span className="font-medium">{t('about.availabilityValue')}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-40 mb-2">{t('about.contact')}</p>
              <a
                href={`mailto:${EMAIL}`}
                className="font-medium hover:opacity-60 transition-opacity whitespace-nowrap"
              >
                {EMAIL}
              </a>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-40 mb-2">{t('about.location')}</p>
              <p className="font-medium">{t('about.locationValue')}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-40 mb-2">{t('about.links')}</p>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:opacity-60 transition-opacity"
              >
                LinkedIn ↗
              </a>
            </div>

            <div className="pt-2">
              <a
                href="/resume.pdf"
                download
                className="inline-block border border-white/30 px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                {t('about.downloadResume')}
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default About;
