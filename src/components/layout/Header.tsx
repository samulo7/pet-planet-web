import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, PawPrint, Search, Sparkles } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { resolveAssetUrl } from '@/utils/asset';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, openLoginModal } = useAuthStore();

  const fallbackAvatar = 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix';
  const avatarUrl =
    resolveAssetUrl((user as any)?.avatar || (user as any)?.avatar_url) || fallbackAvatar;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="flex items-center justify-between rounded-[2rem] border border-cyan-100/80 bg-white/65 px-4 py-3 shadow-[0_24px_45px_-30px_rgba(10,96,170,0.55)] backdrop-blur-xl md:px-6">
      <div className="group flex cursor-pointer items-center gap-3" onClick={() => navigate('/')}>
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-cyan-300/60 blur-md transition group-hover:opacity-90" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-inner">
            <PawPrint size={22} />
          </div>
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-black tracking-wide text-cyan-950 md:text-xl">宠物宇宙</h1>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-cyan-700/80">PET PLANET</span>
        </div>
      </div>

      <div className="group mx-6 hidden max-w-2xl flex-1 md:block">
        <div className="relative flex items-center">
          <Search
            className="absolute left-4 text-cyan-500/75 transition-colors group-focus-within:text-cyan-700"
            size={18}
          />
          <input
            type="text"
            placeholder="搜索视频、经验、用户"
            className="w-full rounded-2xl border border-cyan-100 bg-white/75 py-2.5 pl-11 pr-4 text-sm text-cyan-900 placeholder:text-cyan-500/70 focus:border-cyan-300 focus:outline-none"
          />
          <div className="absolute right-3 rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-500">
            Ctrl+K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-100 bg-white/75 text-cyan-600 transition hover:bg-white hover:text-cyan-700">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400" />
        </button>

        {user ? (
          <div className="group relative flex items-center gap-3 pl-2">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-bold text-cyan-900">{(user as any).nickname}</div>
              <div className="text-[10px] font-semibold text-cyan-600/80">Lv.{(user as any).level || 1} Explorer</div>
            </div>

            <button
              onClick={() => navigate('/user/me')}
              className="relative h-10 w-10 overflow-hidden rounded-full border border-cyan-100 bg-white p-[2px]"
            >
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackAvatar;
                }}
              />
            </button>

            <button
              onClick={handleLogout}
              className="hidden rounded-full border border-cyan-100 bg-white/80 p-2 text-cyan-600 transition hover:bg-white hover:text-rose-500 group-hover:block"
              title="退出登录"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="group relative overflow-hidden rounded-full border border-cyan-300 bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-cyan-600"
          >
            <span className="relative flex items-center gap-1.5">
              <Sparkles size={15} />
              登录
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
