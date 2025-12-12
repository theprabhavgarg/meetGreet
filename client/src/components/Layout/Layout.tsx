import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="pt-20 pb-20 md:pb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;



