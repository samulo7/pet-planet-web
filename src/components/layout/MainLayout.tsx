import React from 'react';
import { Outlet } from 'react-router-dom';

import LoginModal from '../LoginModal';
import { Header } from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#dff7ff] via-[#bde6ff] to-[#8ecbff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-white/45 blur-[90px]" />
        <div className="absolute left-[-80px] top-40 h-72 w-72 rounded-full bg-cyan-200/55 blur-[70px]" />
        <div className="absolute bottom-[-120px] right-[-40px] h-96 w-96 rounded-full bg-sky-300/55 blur-[95px]" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-8">
        <div className="pt-5 md:pt-6">
          <Header />
        </div>

        <LoginModal />

        <main className="relative z-10 min-h-[calc(100vh-150px)] pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
