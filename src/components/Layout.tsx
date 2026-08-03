import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/backlog';

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans">
      {!hideNavbar && <Navbar />}
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
