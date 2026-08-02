import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Backlog = lazy(() => import('./pages/Backlog'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Privacy = lazy(() => import('./components/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="sync">
        <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/backlog" element={<Backlog />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
