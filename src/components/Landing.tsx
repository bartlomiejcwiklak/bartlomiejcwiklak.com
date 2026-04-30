import { motion } from 'framer-motion';
import BackgroundAnimation from './BackgroundAnimation';

const Landing = () => {
  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      <BackgroundAnimation />

      {/* Top Left: Identity */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-sm md:text-base font-bold tracking-tight uppercase">
            Bartłomiej Ćwiklak
          </h1>
        </motion.div>
      </div>

      {/* Top Right: Mission */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10 text-right">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
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
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col gap-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]"
        >
          <div className="flex flex-col gap-2">
            <a href="mailto:contact@bartlomiejcwiklak.com" className="hover:text-zinc-400 transition-colors duration-300">Email</a>
            <a href="https://github.com/bartlomiejcwiklak" target="_blank" rel="noopener" className="hover:text-zinc-400 transition-colors duration-300">GitHub</a>
            <a href="https://linkedin.com/in/bartlomiejcwiklak" target="_blank" rel="noopener" className="hover:text-zinc-400 transition-colors duration-300">LinkedIn</a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Right: Location/Date */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 text-right">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col gap-1 font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest"
        >
          <p>Based in Łódź, Poland</p>
          <p className="text-zinc-700">© 2026 / All Rights Reserved</p>
        </motion.div>
      </div>

      {/* Center Detail (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-[30vw] font-bold select-none"
        >
          001
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
