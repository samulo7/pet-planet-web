import React from 'react';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import LoginModal from '../LoginModal';

const MainLayout: React.FC = () => {
  return (
    // ✨ 1. 背景升级：
    // - bg-[#0F0F1A]: 与 HomePage 保持一致的深黑背景，消除断层
    // - text-white: 全局文字默认白色
    // - selection:xxx: 选中文本时的颜色改为主题色，细节加分
    <div className="min-h-screen bg-[#0F0F1A] font-sans relative text-white selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* ✨ 2. 全局背景氛围光 (可选) */}
      {/* 这是一个固定在顶部的淡淡紫色光晕，让顶部 Header 区域不那么死板，同时呼应星球主题 */}
      <div className="fixed top-[-20%] left-[20%] right-[20%] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* ✨ 3. 内容容器 */}
      {/* 限制最大宽度，确保在大屏幕下内容居中，不会贴边 */}
      <div className="w-full px-6 md:px-10">
        
        {/* Header 位于顶部 */}
        <div className="pt-6">
           <Header />
        </div>

        {/* 登录弹窗 (全局单例) */}
        <LoginModal />

        {/* 页面主体内容 */}
        <main className="relative z-10 pb-12 min-h-[calc(100vh-150px)]">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;