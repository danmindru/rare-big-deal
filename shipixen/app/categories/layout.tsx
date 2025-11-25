import React from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Menu } from '@/app/categories/menu';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <Header className="mb-0 lg:mb-0" />
      <main className="w-full flex flex-col md:flex-row justify-center gap-6 flex-grow container-wide px-4 mt-12">
        <Menu className="flex-shrink-0 w-full md:max-w-[300px] md:sticky top-6 md:overflow-auto md:max-h-[calc(100vh-4rem)]" />
        <div className="w-full flex-shrink flex-grow max-w-[440px] lg:max-w-[640px] xl:max-w-[780px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
