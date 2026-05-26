import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';



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
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      {/* Interactive scrollable layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full overflow-y-auto no-scrollbar"
      >
        <div className="min-h-screen flex flex-col justify-start items-end pb-[40vh] pt-[20vh] pr-6 md:pr-16 w-full">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              custom={idx}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="group cursor-pointer mb-6 md:mb-2 w-full max-w-[95vw] md:max-w-[75vw] text-right origin-right"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <h2 className="font-display font-black text-6xl md:text-9xl tracking-tighter leading-[0.8] break-words hyphens-auto text-wrap">
                <span className="inline-block text-sm font-medium mr-4 md:mr-6 opacity-70 group-hover:opacity-100 transition-opacity font-sans align-middle relative -top-2 md:-top-6 text-white tracking-normal normal-case">
                  {project.year}
                </span>
                <span className="text-[var(--title-color)] group-hover:text-stroke group-hover:text-transparent transition-colors duration-300">
                  {project.title}
                </span>
              </h2>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
