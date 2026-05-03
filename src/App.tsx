import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Privacy from './components/Privacy';
import NotFound from './components/NotFound';
import CustomCursor from './components/CustomCursor';
import BackgroundAnimation from './components/BackgroundAnimation';

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#000000] selection:bg-brand-accent selection:text-white overflow-x-hidden overscroll-behavior-none">
      <div className="noise" />
      <BackgroundAnimation />
      <CustomCursor />

      {/* Persistent Identity (Top Left) */}
      <div className="fixed top-6 left-6 md:top-12 md:left-12 z-50">
        <h1 className="text-sm md:text-base font-bold tracking-tight uppercase text-white">
          Bartłomiej Ćwiklak
        </h1>
      </div>

      {/* Persistent Copyright (Bottom Right) */}
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 text-right pb-[env(safe-area-inset-bottom)]">
        <div className="flex flex-col gap-1 font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest">
          <p>Based in Łódź, Poland</p>
          <div className="flex gap-2 justify-end">
            <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <span className="text-zinc-800">/</span>
            <p className="text-zinc-700">© 2026</p>
          </div>
        </div>
      </div>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;


