import type { ReactNode } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans">
      <Navbar />
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
