import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Image as ImageIcon, BookOpen, UserPlus, MessageCircle, MoreHorizontal } from 'lucide-react';

// ✅ 引入我们刚才新建/存在的 API
import { userAPI } from '@/api/user';
import { videoAPI } from '@/api/video';
import { imageAPI } from '@/api/image';

// ✅ 修正点：加上 type 关键字
import type { User, Video, PetImage } from '@/types/entity'; 

// ... 下面的代码保持不变

// 定义 Tab 类型
type TabType = 'video' | 'image' | 'post';

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 从路由获取用户ID
  const navigate = useNavigate();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<PetImage[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化数据加载
  useEffect(() => {
    // 如果没有 ID，说明可能是访问 /u/me，或者出错，这里暂时处理为必传 ID
    const targetId = id; 
    if (!targetId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. 获取用户信息
        const userRes = await userAPI.getUserProfile(targetId);
        setUserInfo(userRes);

        // 2. 并行获取作品列表 (暂不处理分页，默认取第一页)
        // 注意：这里使用了 Promise.allSettled 防止某一个接口挂了导致全崩
        const [videoRes, imageRes] = await Promise.allSettled([
          videoAPI.getVideoList({ page: 1, page_size: 20, user_id: targetId }),
          imageAPI.getImageList({ page: 1, page_size: 20, user_id: targetId })
        ]);

        if (videoRes.status === 'fulfilled') {
          setVideos(videoRes.value.list);
        }
        
        if (imageRes.status === 'fulfilled') {
          setImages(imageRes.value.list);
        }

      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">加载中...</div>;
  if (!userInfo) return <div className="text-center mt-20 text-gray-500">用户不存在</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. 顶部个人信息卡片 */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto pt-8 pb-6 px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 头像 */}
            <div className="relative group">
              <img 
                src={userInfo.avatar || 'https://via.placeholder.com/150'} 
                alt={userInfo.nickname} 
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>

            {/* 信息区 */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{userInfo.nickname}</h1>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  ID: {userInfo.username}
                </span>
              </div>
              
              <p className="text-gray-600 max-w-lg mx-auto md:mx-0 text-sm leading-relaxed">
                {userInfo.bio || '这个人很懒，什么也没写~'}
              </p>

              {/* 数据统计 */}
              <div className="flex justify-center md:justify-start gap-8">
                <StatItem label="粉丝" value={userInfo.follower_count} />
                <StatItem label="关注" value={userInfo.following_count} />
                <StatItem label="获赞" value={userInfo.reputation_score} /> {/* 暂时用信誉分代替获赞 */}
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-center md:justify-start gap-3 pt-2">
                <button className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium transition shadow-sm shadow-primary-500/30">
                  <UserPlus size={16} /> 关注
                </button>
                <button className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition">
                  <MessageCircle size={16} /> 私信
                </button>
                <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-500">
                   <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 吸顶 Tab 导航栏 */}
      <div className="sticky top-16 z-10 bg-white shadow-sm mt-3">
        <div className="max-w-4xl mx-auto flex justify-center md:justify-start gap-8 px-4">
          <TabButton 
            active={activeTab === 'video'} 
            onClick={() => setActiveTab('video')} 
            icon={<Play size={18} />} 
            label="视频"
            count={videos.length}
          />
          <TabButton 
            active={activeTab === 'image'} 
            onClick={() => setActiveTab('image')} 
            icon={<ImageIcon size={18} />} 
            label="美图"
            count={images.length}
          />
          <TabButton 
            active={activeTab === 'post'} 
            onClick={() => setActiveTab('post')} 
            icon={<BookOpen size={18} />} 
            label="经验"
            count={0} // 暂时为0
          />
        </div>
      </div>

      {/* 3. 内容展示区 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* 视频列表 - Grid */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {videos.map(video => (
              <div 
                key={video.id} 
                className="group relative cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                {/* 封面 */}
                <div className="aspect-[3/4] md:aspect-[16/9] relative bg-gray-100">
                  <img src={video.cover_url} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                {/* 标题 */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-snug">{video.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Play size={12} /> {video.view_count}</span>
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 图片列表 - 瀑布流 (Grid模拟) */}
        {activeTab === 'image' && (
          <div className="columns-2 md:columns-4 gap-4 space-y-4">
            {images.map(img => (
              <div 
                key={img.id} 
                className="relative group rounded-xl overflow-hidden cursor-pointer break-inside-avoid"
                onClick={() => navigate(`/image/${img.id}`)}
              >
                <img src={img.image_url} alt={img.title} className="w-full h-auto object-cover" />
                {img.type === 2 && (
                  <span className="absolute top-2 left-2 bg-purple-500/90 text-white text-[10px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm shadow-sm">AI生成</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 经验帖 (空状态) */}
        {activeTab === 'post' && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <BookOpen size={48} className="mb-4 text-gray-200" />
            <p>还没有发布过经验贴哦</p>
          </div>
        )}

        {/* 通用空状态 */}
        {((activeTab === 'video' && videos.length === 0) || 
          (activeTab === 'image' && images.length === 0)) && (
          <div className="text-center py-20 text-gray-400">
            <p>暂无内容</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 辅助组件 ---

const StatItem = ({ label, value }: { label: string, value: number }) => (
  <div className="text-center cursor-pointer hover:opacity-80 transition">
    <span className="block font-bold text-lg text-gray-900">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

const TabButton = ({ active, onClick, icon, label, count }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-all duration-200 ${
      active 
        ? 'border-primary-500 text-primary-600 font-medium' 
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
    <span className={`text-xs ${active ? 'text-primary-400' : 'text-gray-300'}`}>{count}</span>
  </button>
);

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ✅ 确保这里有 export default
export default UserProfilePage;