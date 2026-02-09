import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, openLoginModal } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    // 玻璃拟态 Header 容器
    <header className="flex items-center justify-between px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/5">
      
      {/* 1. Logo 区域 */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => navigate('/')}
      >
        <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl flex items-center justify-center shadow-inner border border-white/20 group-hover:rotate-12 transition-transform duration-300">
               <span className="text-2xl drop-shadow-md">🐱</span>
            </div>
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-wide text-white font-mono uppercase">Pet Planet</h1>
            <span className="text-[10px] text-gray-400 tracking-widest -mt-1 group-hover:text-orange-400 transition-colors">UNIVERSE</span>
        </div>
      </div>
      
      {/* 2. 搜索框 - 极简风格 */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:block group">
        <div className="relative flex items-center">
            <Search className="absolute left-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索猫咪、星球、铲屎官..." 
              className="w-full bg-black/20 text-gray-200 placeholder-gray-600 pl-11 pr-4 py-2.5 rounded-2xl border border-white/5 focus:border-white/20 focus:bg-black/40 focus:outline-none transition-all duration-300"
            />
            <div className="absolute right-3 px-2 py-0.5 rounded bg-white/10 text-[10px] text-gray-500 border border-white/5">⌘ K</div>
        </div>
      </div>

      {/* 3. 右侧功能区 */}
      <div className="flex items-center gap-3">
        
        {/* 铃铛 */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#09090b]"></span>
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

        {user ? (
          <div className="flex items-center gap-3 pl-2 cursor-pointer group relative">
            <div className="text-right hidden sm:block">
               <div className="text-sm font-bold text-gray-200 group-hover:text-white">{user.nickname}</div>
               <div className="text-[10px] text-indigo-400 font-mono">Lv.{user.level || 9} EXPLORER</div>
            </div>
            
            <div className="relative" onClick={() => navigate(`/user/${user.id}`)}>
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity duration-500"></div>
               <div className="relative w-10 h-10 rounded-full bg-gray-800 p-[2px] overflow-hidden border border-white/10">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">U</div>
                  )}
               </div>
            </div>

            {/* 退出按钮 (Hover显示) */}
            <button 
              onClick={handleLogout}
              className="absolute -right-8 opacity-0 group-hover:opacity-100 p-2 hover:text-red-400 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={openLoginModal}
            className="group relative px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
               <Sparkles size={16} /> 登船
            </span>
          </button>
        )}
      </div>
    </header>
  );
};