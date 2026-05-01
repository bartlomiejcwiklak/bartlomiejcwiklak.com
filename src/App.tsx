import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './components/Landing';
import Portfolio from './components/Portfolio';
import CustomCursor from './components/CustomCursor';
import BackgroundAnimation from './components/BackgroundAnimation';

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#000000] selection:bg-brand-accent selection:text-white overflow-x-hidden">
      <div className="noise" />
      <BackgroundAnimation />
      <CustomCursor />

      {/* Persistent Identity (Top Left) */}
      <div className="fixed top-8 left-8 md:top-12 md:left-12 z-50">
        <h1 className="text-sm md:text-base font-bold tracking-tight uppercase text-white">
          Bartłomiej Ćwiklak
        </h1>
      </div>

      {/* Persistent Copyright (Bottom Right) */}
      <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 text-right">
        <div className="flex flex-col gap-1 font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest">
          <p>Based in Łódź, Poland</p>
          <p className="text-zinc-700">© 2026 / All Rights Reserved</p>
        </div>
      </div>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;


