import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[100dvh] w-full bg-transparent text-white flex flex-col items-center justify-center font-sans"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Error 404</span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase">Not Found</h1>
        </div>
        
        <p className="font-mono text-[10px] md:text-xs text-zinc-400 uppercase tracking-widest text-center max-w-[280px]">
          The page you are looking for does not exist or has been moved.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link 
            to="/" 
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-white hover:text-zinc-400 transition-colors duration-300 border-b border-white/20 pb-1"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;
