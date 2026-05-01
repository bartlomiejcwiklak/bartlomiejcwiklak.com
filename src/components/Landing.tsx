import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative h-screen w-full bg-transparent text-white overflow-hidden font-sans selection:bg-white selection:text-black">


      {/* Top Right: Mission */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10 text-right">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.8, ease: "easeIn", delay: 0.1 }}
          className="max-w-[180px] md:max-w-xs"
        >
          <p className="text-[10px] md:text-xs text-zinc-400 leading-relaxed font-mono uppercase tracking-widest">
            A poland-based graphic designer and web developer. Sometimes more.
          </p>
        </motion.div>
      </div>

      {/* Bottom Left: Contact */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeIn", delay: 0.2 }}
          className="flex flex-col gap-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]"
        >
          <div className="flex flex-col gap-2">
            <Link to="/portfolio" className="hover:text-zinc-400 transition-colors duration-300">Portfolio</Link>
            <a href="mailto:contact@bartlomiejcwiklak.com" className="hover:text-zinc-400 transition-colors duration-300">Email</a>
            <a href="https://github.com/bartlomiejcwiklak" target="_blank" rel="noopener" className="hover:text-zinc-400 transition-colors duration-300">GitHub</a>
            <a href="https://linkedin.com/in/bartlomiejcwiklak" target="_blank" rel="noopener" className="hover:text-zinc-400 transition-colors duration-300">LinkedIn</a>
          </div>
        </motion.div>
      </div>


    </div>
  );
};

export default Landing;
