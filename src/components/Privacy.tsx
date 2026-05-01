import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] w-full bg-transparent text-white px-6 py-20 md:px-12 md:py-32 font-sans overflow-y-auto no-scrollbar"
    >
      {/* Navigation */}
      <div className="fixed bottom-6 left-6 md:bottom-12 md:left-12 z-50 pb-[env(safe-area-inset-bottom)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/" 
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500 hover:text-white transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Back to Home
          </Link>
        </motion.div>
      </div>

      <div className="max-w-3xl md:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-12"
        >
          {/* Header */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.3em]">Legal</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">Privacy Policy</h1>
            <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Last Updated: May 2026</p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-12 text-zinc-400 leading-relaxed text-sm md:text-base">
            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em]">Introduction</h2>
              <p>
                Your privacy is important to me. This policy explains how I handle any data that might be collected when you visit my portfolio website.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em]">Data Collection</h2>
              <p>
                As a static portfolio website, I do not actively collect personal data. There are no registration forms, newsletters, or accounts. 
              </p>
              <p>
                However, standard server logs or third-party hosting services (like GitHub Pages or Vercel) may collect basic information such as IP addresses, browser types, and visit timestamps for security and performance monitoring.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em]">Cookies</h2>
              <p>
                This site does not use tracking cookies. Any cookies used would be strictly necessary for the technical operation of the website.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em]">External Links</h2>
              <p>
                My portfolio contains links to external sites (GitHub, LinkedIn, live demos). I am not responsible for the privacy practices or content of these third-party websites.
              </p>
            </section>

            <section className="flex flex-col gap-4 border-t border-zinc-800 pt-12 mt-12 mb-20">
              <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em]">Contact</h2>
              <p>
                If you have any questions regarding this policy, feel free to reach out via email.
              </p>
              <a 
                href="mailto:contact@bartlomiejcwiklak.com" 
                className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                contact@bartlomiejcwiklak.com
              </a>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Privacy;
