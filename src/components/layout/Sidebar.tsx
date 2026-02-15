import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Home, LogOut, Plus } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { resolveAssetUrl } from '@/utils/asset';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
};

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, openLoginModal } = useAuthStore();

  const fallbackAvatar = 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix';
  const avatarUrl =
    resolveAssetUrl((user as any)?.avatar || (user as any)?.avatar_url) || fallbackAvatar;

  const isActive = (path: string) => location.pathname === path;

  const NavItem: React.FC<NavItemProps> = ({ icon, label, path, onClick }) => {
    const active = path ? isActive(path) : false;
    return (
      <button
        onClick={onClick || (path ? () => navigate(path) : undefined)}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group font-medium ${
          active
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-[1.02]'
            : 'text-gray-600 hover:bg-orange-100/50 hover:text-orange-600'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-xl shadow-orange-100/50 p-5">
      <div className="px-4 py-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <span className="text-orange-500">Pet</span>
          <span className="text-gray-800">Planet.</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<Home size={22} />} label="首页" path="/" />
        <NavItem icon={<Compass size={22} />} label="社区经验" path="/community" />
      </nav>

      <div className="mt-auto space-y-4">
        {user ? (
          <button
            onClick={() => navigate('/upload')}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-2xl py-3 font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={3} /> 发布内容
          </button>
        ) : null}

        {user ? (
          <div
            className="flex items-center gap-3 px-3 py-3 bg-white/50 rounded-2xl border border-white/60 cursor-pointer"
            onClick={() => navigate('/user/me')}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img
                src={avatarUrl}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackAvatar;
                }}
              />
            </div>
            <div className="flex-1 truncate">
              <div className="font-bold text-sm truncate">{(user as any).nickname || '用户'}</div>
              <div className="text-xs text-gray-500">个人中心</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="w-full bg-gray-900 text-white rounded-2xl py-3.5 font-bold hover:bg-black transition-colors"
          >
            登录 / 注册
          </button>
        )}
      </div>
    </aside>
  );
};
