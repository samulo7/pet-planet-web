import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Upload, PlayCircle, Heart, Grid, 
  User as UserIcon, Zap, MessageCircle, Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { videoAPI } from '@/api/video';
import { imageAPI } from '@/api/image';
import type { Video, PetImage } from '@/types/entity';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<PetImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, imageRes] = await Promise.all([
          videoAPI.getVideoList({ page: 1, page_size: 8 }),
          imageAPI.getImageList({ page: 1, page_size: 6 })
        ]);
        setVideos(videoRes.list || []);
        setImages(imageRes.list || []);
      } catch (error) {
        console.error("加载失败", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white p-6 md:p-10 relative overflow-hidden">
      {/* 背景光晕 - 稍微调大一点 */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* ✨ 核心修改 1：gap-8 改为 gap-10 (40px)，拉大三栏间距 */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-10 relative z-10">
        
        {/* === 左侧导航栏 (Col-2) === */}
        <aside className="col-span-2 flex flex-col gap-3 sticky top-24 h-fit pt-2">
          <NavCard icon={<Grid />} label="探索首页" active />
          <NavCard icon={<PlayCircle />} label="撸猫视频" />
          <NavCard icon={<Heart />} label="萌宠推荐" />
          <NavCard icon={<MessageCircle />} label="经验分享" />
          
          <div className="my-8 border-t border-white/5 mx-2"></div>
          
          <p className="text-xs text-gray-500 mb-4 px-4 uppercase tracking-widest font-bold">Personal</p>
          <NavCard icon={<UserIcon />} label="个人中心" />
          <NavCard icon={<Zap />} label="任务中心" />
        </aside>

        {/* === 中间核心内容 (Col-7) === */}
        {/* ✨ 核心修改 2：space-y-8 改为 space-y-12 (48px)，拉大板块垂直间距 */}
        <main className="col-span-7 space-y-12">
          
          {/* 1. 顶部 Banner 区域 */}
          {/* ✨ 核心修改 3：高度由 h-72 增加到 h-80，gap-6 改为 gap-8 */}
          <div className="grid grid-cols-5 gap-8 h-80">
            {/* 发布卡片 */}
            <div className="col-span-2 bg-gradient-to-br from-[#FF8F5A] to-[#FF5F3A] rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-black leading-none tracking-tight">DRAG &<br/>DROP</h2>
                <p className="text-orange-100/90 text-sm mt-4 font-medium tracking-wide">即刻分享萌宠瞬间</p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border-[40px] border-white/10 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            </div>

            {/* 欢迎 Banner */}
            <div className="col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden group hover:bg-white/[0.07] transition-colors">
               <div className="relative z-10 max-w-[80%]">
                 <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">Pet Planet</h2>
                 <p className="text-gray-400 mb-10 leading-relaxed text-base">连接每一位铲屎官，记录每一个治愈瞬间。</p>
                 <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all group-hover:pl-10 duration-300 shadow-lg shadow-white/10">
                   立即探索 <ArrowRight size={20} />
                 </button>
               </div>
               <div className="absolute -right-6 -bottom-10 text-[200px] opacity-20 rotate-12 group-hover:rotate-[20deg] group-hover:scale-110 transition-all duration-500 grayscale mix-blend-overlay pointer-events-none">
                 🐱
               </div>
            </div>
          </div>

          {/* 2. 视频流 */}
          <section>
            <div className="flex justify-between items-end mb-8 px-2">
              <div>
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  <PlayCircle className="text-orange-500" fill="currentColor" size={32} /> 
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">撸猫时刻</span>
                </h3>
                <p className="text-sm text-gray-500 mt-2 tracking-wide">捕捉生活中的可爱暴击</p>
              </div>
              <button className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1 group">
                查看更多 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>
            
            {/* ✨ 核心修改 4：gap-5 改为 gap-6 */}
            <div className="grid grid-cols-4 gap-6">
              {loading ? [1,2,3,4].map(i => <Skeleton key={i}/>) : videos.slice(0, 4).map(video => (
                <div key={video.id} onClick={() => navigate(`/video/${video.id}`)} className="group cursor-pointer">
                  <div className="bg-gray-800/50 rounded-[2rem] overflow-hidden aspect-[3/4] relative mb-4 border border-white/5 group-hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-black/20">
                    {video.cover_url ? (
                      <img src={video.cover_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={video.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900"><PlayCircle size={32} className="text-gray-700"/></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                       <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 scale-75 group-hover:scale-100 transition-transform">
                         <PlayCircle size={28} fill="white" className="text-white" />
                       </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-base text-gray-200 line-clamp-1 group-hover:text-purple-400 transition-colors px-1">{video.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 px-1">{video.view_count} 次观看</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 美图流 */}
          <section>
             <div className="flex items-center gap-3 mb-8 px-2">
               <div className="p-2.5 bg-pink-500/10 rounded-xl"><ImageIcon className="text-pink-500" size={24} /></div>
               <h3 className="text-2xl font-bold">萌宠图鉴</h3>
             </div>
             
             <div className="grid grid-cols-3 gap-6">
               {images.slice(0, 3).map(img => (
                 <div key={img.id} className="bg-[#1A1A24]/60 border border-white/5 rounded-[2rem] p-4 hover:bg-[#20202E] transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10">
                   <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                     <img src={img.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     {img.type === 2 && (
                       <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] px-2.5 py-1 rounded-full text-white flex items-center gap-1 border border-white/10">
                         <Sparkles size={10} className="text-yellow-400" /> AI
                       </span>
                     )}
                   </div>
                   <div className="px-1 pb-1">
                     <h4 className="font-bold text-base text-gray-200 truncate">{img.title}</h4>
                     <div className="flex items-center gap-2 mt-2">
                        <div className="w-5 h-5 rounded-full bg-gray-700"></div>
                        <span className="text-xs text-gray-500">发布者</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </main>

        {/* === 右侧侧边栏 (Col-3) === */}
        {/* ✨ 核心修改 5：space-y-6 改为 space-y-8 */}
        <aside className="col-span-3 space-y-8 pt-2">
          
          {/* AI 卡片 */}
          <div className="bg-gradient-to-b from-[#1E3E38] to-[#122220] border border-[#2A5A50] rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-[#4FD1C5]/50 transition-colors">
             <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
             <div className="relative z-10 text-center py-4">
                <div className="w-20 h-20 bg-[#2A5A50] rounded-3xl mx-auto flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#2A5A50]/40">
                  <Sparkles size={40} className="text-[#4FD1C5]" />
                </div>
                <h3 className="font-bold text-2xl text-[#4FD1C5] mb-2">AI 宠物生成</h3>
                <p className="text-sm text-[#5dafa7] mb-8 font-medium">Create your dream pet</p>
                <button className="w-full bg-[#4FD1C5] text-[#0F2926] py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-lg shadow-[#4FD1C5]/20 hover:scale-[1.02] active:scale-95">
                  开始生成
                </button>
             </div>
          </div>

          {/* 排行榜 */}
          <div className="bg-[#151520]/80 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold text-lg">贡献榜</h3>
               <span className="text-xs text-gray-500 hover:text-white cursor-pointer px-2 py-1 hover:bg-white/10 rounded-lg transition">全部</span>
             </div>
             <div className="space-y-6">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center gap-5 group cursor-pointer">
                    <div className={`w-6 text-center font-black text-xl italic ${i===1?'text-yellow-500':i===2?'text-gray-400':'text-orange-700'}`}>0{i}</div>
                    <div className="w-12 h-12 rounded-full bg-gray-800 border border-white/5 group-hover:border-purple-500 transition-colors"></div>
                    <div>
                      <div className="text-sm font-bold text-gray-200 group-hover:text-purple-400 transition-colors">用户{9527+i}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Lv.{10-i} • 铲屎官</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* 客服卡片 */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/5 p-5 rounded-3xl flex items-center gap-5 cursor-pointer hover:border-white/20 transition hover:bg-white/5">
             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
               <MessageCircle size={24} fill="white" className="text-white" />
             </div>
             <div>
               <div className="font-bold text-sm text-gray-200">在线客服</div>
               <div className="text-xs text-gray-500 mt-1">遇到问题？随时联系</div>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

const NavCard = ({ icon, label, active = false }: any) => (
  <div className={`
    flex items-center gap-5 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-200 group
    ${active 
      ? 'bg-white text-black font-bold shadow-xl shadow-white/10 scale-105' 
      : 'text-gray-400 hover:bg-white/5 hover:text-white'}
  `}>
    {React.cloneElement(icon, { 
      size: 24, 
      className: active ? 'text-purple-600' : 'group-hover:text-purple-400 transition-colors' 
    })}
    <span className="text-[16px]">{label}</span>
  </div>
);

const Skeleton = () => (
  <div className="bg-white/5 rounded-[2rem] animate-pulse aspect-[3/4] border border-white/5"></div>
);

export default HomePage;