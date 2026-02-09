import React, { useState } from 'react';
import { 
  Search, Bell, ShieldCheck, MoreHorizontal, 
  Heart, MessageCircle, Share2, 
  Home, Utensils, Sparkles, User 
} from 'lucide-react';

// === 1. 假数据定义 (Mock Data) ===
const MOCK_USER = {
  id: 1,
  nickname: "猫奴小王",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
};

const MOCK_POSTS = [
  {
    id: 101,
    user: MOCK_USER,
    time: "2小时前",
    is_verified: true, // 是否验真订单
    content: "渴望(Orijen)这款原味鸡肉其实适口性很好，家里两只挑嘴怪都爱吃。看大家说有假货，特意来宠物星球验真了一下订单才敢开袋！📸",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop", // 猫
      "https://images.unsplash.com/photo-1589924691195-41432c84c161?w=600&h=400&fit=crop"  // 粮
    ],
    is_liked: false,
    like_count: 128,
    comment_count: 32,
    product_link: "Orijen原始猎食渴望 鸡肉味 5.4kg"
  },
  {
    id: 102,
    user: {
      id: 2,
      nickname: "铲屎官阿强",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    time: "5小时前",
    is_verified: false,
    content: "今天的阳光真好，晒个猫~ 🌞",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
    ],
    is_liked: true,
    like_count: 1024,
    comment_count: 88,
  }
];

// === 2. 页面主组件 ===
const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('推荐');
  // 直接使用 Mock 数据初始化 State
  const [posts, setPosts] = useState(MOCK_POSTS);

  // ✅ 核心复用：点赞逻辑 (和之前视频页的一模一样)
  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(item => {
      if (item.id === postId) {
        const newIsLiked = !item.is_liked;
        return {
          ...item,
          is_liked: newIsLiked,
          like_count: newIsLiked ? item.like_count + 1 : item.like_count - 1
        };
      }
      return item;
    }));
    // 这里发送后端请求...
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-slate-800">
      
      {/* --- 顶部导航栏 (Header) --- */}
      <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1">
           {/* Logo 示意 */}
           <div className="text-emerald-500 text-xl font-bold flex items-center gap-1">
             <span className="text-2xl">🐾</span> 宠物星球
           </div>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <Search size={22} />
          <div className="relative">
             <Bell size={22} />
             <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <img src={MOCK_USER.avatar} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        
        {/* --- 1. Banner 区域 --- */}
        <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-emerald-900 shadow-lg group">
          <img 
            src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" 
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h2 className="text-2xl font-bold mb-1">全网首个“真”粮仓</h2>
            <p className="text-emerald-100 text-sm opacity-90">订单验真 · 科学评测 · 隐私无忧</p>
          </div>
        </div>

        {/* --- 2. 胶囊 Tab 栏 --- */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {['推荐', '验真晒单', '避雷专区', 'AI 创作'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all
                ${activeTab === tab 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                  : 'bg-white text-gray-500 border border-gray-100'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- 3. 帖子列表 (Feed) --- */}
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} />
          ))}
        </div>

      </div>

      {/* --- 底部固定导航栏 (Bottom TabBar) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 pb-safe">
         <NavItem icon={<Home size={24} />} label="社区" active />
         <NavItem icon={<Utensils size={24} />} label="粮仓" />
         <div className="w-10"></div> {/* 占位给中间按钮 */}
         <NavItem icon={<Sparkles size={24} />} label="AI创作" />
         <NavItem icon={<User size={24} />} label="我的" />
         
         {/* 中间凸起的大按钮 */}
         <div className="absolute left-1/2 -translate-x-1/2 -top-6">
           <button className="w-14 h-14 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-300 flex items-center justify-center hover:scale-105 transition">
             <span className="text-2xl">+</span>
           </button>
         </div>
      </div>

    </div>
  );
};

// === 3. 子组件：帖子卡片 (核心复用部分) ===
const PostCard = ({ post, onLike }: { post: any, onLike: () => void }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      
      {/* 头部：用户信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
            <img src={post.user.avatar} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-gray-800">{post.user.nickname}</h3>
              <span className="text-xs text-gray-400">• {post.time}</span>
            </div>
            {post.is_verified && (
              <div className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded mt-0.5 w-fit font-medium">
                <ShieldCheck size={10} /> 订单已验真
              </div>
            )}
          </div>
        </div>
        <button className="text-gray-300 hover:text-gray-600"><MoreHorizontal size={20} /></button>
      </div>

      {/* 正文 */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        {post.content}
      </p>

      {/* 图片九宫格逻辑 */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${
          post.images.length === 1 ? 'grid-cols-1' : 
          post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          {post.images.map((img: string, index: number) => (
             <div key={index} className={`relative overflow-hidden ${post.images.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
               <img src={img} className="w-full h-full object-cover" />
             </div>
          ))}
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
         {/* 复用了你熟悉的 ActionButton 逻辑 */}
         <div className="flex gap-6">
            <ActionButton 
              active={post.is_liked} 
              onClick={onLike}
              icon={<Heart size={20} className={post.is_liked ? "fill-current" : ""} />} 
              label={post.like_count} 
              activeColor="text-red-500"
            />
            <ActionButton 
              icon={<MessageCircle size={20} />} 
              label={post.comment_count} 
            />
            <ActionButton 
              icon={<Share2 size={20} />} 
              label="分享" 
            />
         </div>
         
         {/* 截图里那个特有的绿色按钮 */}
         {post.is_verified && (
            <button className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-emerald-600 transition flex items-center gap-1">
               <ShieldCheck size={14} /> 验真晒单
            </button>
         )}
      </div>

    </div>
  );
};

// 底部导航按钮组件
const NavItem = ({ icon, label, active }: any) => (
  <button className={`flex flex-col items-center gap-1 ${active ? 'text-emerald-500' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// 交互按钮组件 (复用版)
const ActionButton = ({ active, onClick, icon, label, activeColor = "text-emerald-500" }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1 transition-all ${active ? activeColor : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default CommunityPage;