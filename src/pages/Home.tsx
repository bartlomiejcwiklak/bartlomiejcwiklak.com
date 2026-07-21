import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';

const itemVariants = {
  hidden: { opacity: 0, x: 100, rotateY: -15, skewX: 0 },
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    rotateY: -10,
    skewX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      delay: idx * 0.1,
    }
  }),
  hover: {
    rotateY: 0,
    skewX: -6,
    scale: 1.03,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  usePageMeta({
    title: i18n.language === 'pl'
      ? 'Bartlomiej Cwiklak | Projekty graficzne i web design'
      : 'Bartlomiej Cwiklak | Graphic Design and Web Projects',
    description: i18n.language === 'pl'
      ? 'Portfolio Bartłomieja Ćwiklaka: branding, design graficzny, plakaty i nowoczesne strony internetowe.'
      : 'Portfolio of Bartlomiej Cwiklak: branding, graphic design, posters, and modern web design projects.',
    path: '/',
    lang: i18n.language,
  });

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full overflow-y-auto no-scrollbar"
      >
        <div className="min-h-screen flex flex-col justify-start items-end pb-[40vh] pt-[20vh] pr-6 md:pr-16 w-full">
          {projects.map((project, idx) => (
            <motion.button
              key={project.id}
              type="button"
              custom={idx}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="group cursor-pointer w-full max-w-[95vw] md:max-w-[75vw] text-right origin-right border-b border-white/10 py-3 md:py-2 last:border-b-0 block bg-transparent border-x-0 border-t-0"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="flex items-center justify-end gap-3 mb-1">
                <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.18em] text-white/40 group-hover:text-white/75 transition-colors duration-300">
                  {t(`categories.${project.category}`, project.category)}
                </span>
                <span className="w-px h-3 bg-white/20 shrink-0" />
                <span className="text-[10px] md:text-xs font-sans tabular-nums text-white/40 group-hover:text-white/75 transition-colors duration-300">
                  {project.year}
                </span>
              </div>

              <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] break-words hyphens-auto text-wrap">
                <span className="text-[var(--title-color)] group-hover:text-stroke group-hover:text-transparent transition-colors duration-300">
                  {project.title}
                </span>
              </h2>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
