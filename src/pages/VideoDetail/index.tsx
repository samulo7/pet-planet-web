import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, Star, Share2, MessageCircle, Send, 
  ThumbsUp, PlayCircle, Clock, Loader2 
} from 'lucide-react';
import { videoAPI, commentAPI } from '@/api/video';
import type { Video, Comment } from '@/types/entity';
import { resolveAssetUrl } from '@/utils/asset';

const VideoDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fallbackAvatar = 'https://placehold.co/100x100?text=U';
  const fallbackSelfAvatar = 'https://placehold.co/100x100?text=Me';
  const storedUserInfo = (() => {
    const raw = localStorage.getItem('user_info');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();
  const currentUserAvatar =
    resolveAssetUrl(storedUserInfo?.avatar || storedUserInfo?.avatar_url) || fallbackSelfAvatar;
  
  // === 状态定义 ===
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // ✅ 唯一数据源：评论列表
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // === 视频交互状态 ===
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // 视频的点赞数

  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  // === 加载数据 ===
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [detailRes, commentRes, likeCountRes] = await Promise.all([
          videoAPI.getVideoDetail(id),
          videoAPI.getVideoComments({ target_type: 1, target_id: id, page: 1, page_size: 20 }),
          videoAPI.getLikeCount(id).catch(() => ({ like_count: 0, video_id: Number(id) }))
        ]);
  
        const videoData = detailRes as unknown as Video;
        setVideo(videoData);
  
        // 初始化视频状态
        setLikeCount(likeCountRes.like_count || 0);
        setIsLiked(videoData.is_liked || false);     
        setIsStarred(videoData.is_collected || false);
  
        // ✅ 修复：直接使用后端返回的列表 (后端现在已经包含了 is_liked)
        const list = (commentRes as any)?.data?.list || [];
        setComments(list);
        
        // --- ❌ 已删除旧的 commentLikes 初始化逻辑 ---
  
        // 模拟推荐视频
        const mockCovers = [
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300&h=200&fit=crop",
          "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=300&h=200&fit=crop",
          "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=300&h=200&fit=crop",
          "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=300&h=200&fit=crop"
        ];
        const mockTitles = [
          "猫咪迷惑行为大赏：这真的是碳基生物？",
          "超治愈！在阳光下打盹的小奶猫",
          "当主子第一次遇到扫地机器人...",
          "沉浸式撸猫指南，学会了主子更爱你"
        ];
  
        setRelatedVideos([1, 2, 3, 4].map(i => ({
          id: i, 
          title: mockTitles[i-1], 
          cover: mockCovers[i-1], 
          views: `${(Math.random() * 20 + 1).toFixed(1)}w`
        })));
  
      } catch (error) {
        console.error("加载失败:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // === 视频点赞逻辑 ===
  const handleToggleLike = async () => {
    if (!video) return;
    
    // 乐观更新
    const prevIsLiked = isLiked;
    const prevCount = likeCount;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    try {
      const res: any = await videoAPI.toggleLike(video.id);
      if (res && typeof res.is_liked === 'boolean') {
        if (res.is_liked !== newLikedState) {
             setIsLiked(res.is_liked);
             setLikeCount(prevCount); // 状态不对时回滚
        }
      }
    } catch (error) {
      console.error("视频点赞失败", error);
      setIsLiked(prevIsLiked);
      setLikeCount(prevCount);
    }
  };

  // === 视频收藏逻辑 ===
  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    // TODO: videoAPI.collectVideo(...)
  };

  // === 发送评论逻辑 ===
  const handleSendComment = async () => {
    if (!commentText.trim() || !id) return;
    if (!localStorage.getItem('token')) return alert("请先登录喵~");

    setSending(true);
    try {
      const res: any = await videoAPI.createComment({
        target_type: 1,
        target_id: Number(id),
        content: commentText
      });

      const userInfoStr = localStorage.getItem('user_info');
      const currentUser = userInfoStr ? JSON.parse(userInfoStr) : { nickname: '我', avatar: '' };
      
      const newComment: Comment = {
        id: res.id || Date.now(),
        user_id: currentUser.id,
        target_type: 1,
        target_id: Number(id),
        parent_id: null,
        content: commentText,
        like_count: 0,
        reply_count: 0,
        status: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: currentUser,
        is_liked: false // 新发评论默认未点赞
      };

      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error("评论失败:", error);
    } finally {
      setSending(false);
    }
  };

  // === ✅ 核心修复：评论点赞逻辑 ===
  const handleCommentLike = async (commentId: number) => {
    if (!localStorage.getItem('token')) {
      alert('请先登录');
      return;
    }
    
    // 1. 乐观更新：直接修改 comments 数组，界面秒变
    setComments(prev => prev.map(item => {
      if (item.id === commentId) {
        const newIsLiked = !item.is_liked; // 取反
        return {
          ...item,
          is_liked: newIsLiked,
          // 根据新状态 +1 或 -1
          like_count: newIsLiked ? item.like_count + 1 : item.like_count - 1
        };
      }
      return item;
    }));
    
    // 2. 发送请求
    try {
      await commentAPI.toggleLike(commentId);
    } catch (error) {
      console.error('评论点赞失败:', error);
      // 3. 失败回滚：再次取反状态和数字
      setComments(prev => prev.map(item => {
        if (item.id === commentId) {
          const originalIsLiked = !item.is_liked; 
          return {
            ...item,
            is_liked: originalIsLiked,
            like_count: originalIsLiked ? item.like_count + 1 : item.like_count - 1
          };
        }
        return item;
      }));
    }
  };

  if (loading) return <div className="min-h-screen bg-planet-bg flex items-center justify-center text-purple-300"><Loader2 className="animate-spin" /> 正在连接星球信号...</div>;
  if (!video) return null;
  const posterUrl = resolveAssetUrl(video.cover_url);
  const videoSrc = resolveAssetUrl(video.transcoded_url || video.video_url);

  return (
    <div className="min-h-screen bg-planet-bg text-planet-text p-6 pt-0">
      <div className="grid grid-cols-12 gap-8">
        
        {/* === 左侧内容 (占9列) === */}
        <div className="col-span-9 space-y-6">
          
          {/* 1. 播放器 */}
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-primary-600 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
             <div className="relative bg-black rounded-[2rem] overflow-hidden shadow-2xl aspect-video border border-white/10">
               <video
                 src={videoSrc}
                 poster={posterUrl || undefined}
                 controls
                 className="w-full h-full object-contain"
               />
             </div>
          </div>

          {/* 2. 视频信息 & 按钮组 */}
          <div>
            <h1 className="text-2xl font-bold mb-3 leading-relaxed">{video.title}</h1>
            <div className="flex items-center justify-between text-purple-300 text-sm pb-6 border-b border-white/10">
              
              {/* 左侧：观看数据 */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><PlayCircle size={16} /> {video.view_count}次观看</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {new Date(video.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* 右侧：操作按钮 */}
              <div className="flex items-center gap-2">
                <ActionButton 
                  active={isLiked} 
                  onClick={handleToggleLike}
                  icon={<Heart size={20} className={isLiked ? "fill-current" : ""} />}
                  label={likeCount} 
                  activeColor="text-red-500 bg-red-500/10"
                />

                <ActionButton 
                  active={isStarred} 
                  onClick={handleToggleStar}
                  icon={<Star size={20} className={isStarred ? "fill-current" : ""} />}
                  label={video.collect_count + (isStarred ? 1 : 0)} 
                  activeColor="text-yellow-400 bg-yellow-400/10"
                />

                <ActionButton icon={<Share2 size={20} />} label="分享" />
              </div>
            </div>
          </div>

          {/* 3. 作者卡片 */}
          <div className="bg-planet-card/50 rounded-2xl p-4 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => video.user?.id && navigate(`/user/${video.user.id}`)}>
              <div className="w-12 h-12 rounded-full border-2 border-primary-500 p-0.5 overflow-hidden">
                 <img
                   src={
                     resolveAssetUrl((video.user as any)?.avatar || (video.user as any)?.avatar_url) ||
                     fallbackAvatar
                   }
                   className="w-full h-full object-cover"
                   alt="avatar"
                   onError={(e) => {
                     e.currentTarget.src = fallbackAvatar;
                   }}
                 />
              </div>
              <div>
                <h3 className="font-bold text-base hover:text-primary-400 transition">{video.user?.nickname || '神秘铲屎官'}</h3>
                <p className="text-xs text-purple-300">{video.user?.follower_count || 0} 粉丝</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-primary-500 to-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">+ 关注</button>
          </div>

          {/* 4. 简介 */}
          <div className="bg-black/20 rounded-2xl p-4 text-purple-100 text-sm leading-6">
            {video.description || "暂无简介"}
          </div>

          {/* 5. 评论区 */}
          <div className="pt-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="text-primary-500" /> 全部评论 <span className="text-sm text-purple-300 font-normal">({comments.length})</span>
            </h3>
            
            {/* 发送框 */}
            <div className="flex gap-4 mb-8">
               <div className="w-12 h-12 rounded-full bg-purple-800 overflow-hidden flex-shrink-0">
                  <img
                    src={currentUserAvatar}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackSelfAvatar;
                    }}
                  />
               </div>
               <div className="flex-1 relative">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="发一条友善的评论..."
                  className="w-full bg-planet-card/50 border border-white/10 rounded-2xl p-4 min-h-[100px] text-white placeholder-purple-400/50 focus:outline-none focus:border-primary-500/50 transition resize-none"
                />
                <button 
                  onClick={handleSendComment}
                  disabled={!commentText.trim() || sending}
                  className="absolute bottom-3 right-3 bg-primary-500 p-2 rounded-xl text-white hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>

            {/* 评论列表 */}
            <div className="space-y-6">
               {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                     <div className="w-10 h-10 rounded-full bg-purple-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            resolveAssetUrl(
                              (comment.user as any)?.avatar || (comment.user as any)?.avatar_url
                            ) || fallbackAvatar
                          }
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = fallbackAvatar;
                          }}
                        />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-sm text-purple-100">{comment.user?.nickname}</span>
                        </div>
                        <p className="text-sm text-purple-200 leading-relaxed mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4 text-xs text-purple-400">
                        {/* ✅ 修复后的点赞按钮 */}
                        <button 
                          onClick={() => handleCommentLike(comment.id)}
                          className={`flex items-center gap-1 transition ${
                            comment.is_liked 
                              ? 'text-primary-500' 
                              : 'text-purple-400 hover:text-primary-500'
                          }`}
                        >
                          <ThumbsUp 
                            size={14} 
                            className={comment.is_liked ? 'fill-current' : ''}
                          /> 
                          {comment.like_count}
                        </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* === 右侧推荐 (占3列) === */}
        <div className="col-span-3 space-y-6">
           <h3 className="font-bold text-lg px-1">接下来播放</h3>
           <div className="space-y-4">
             {relatedVideos.map((item: any) => (
               <div key={item.id} className="group cursor-pointer flex gap-3 p-2 rounded-2xl hover:bg-white/5 transition" onClick={() => navigate(`/video/${item.id}`)}>
                 <div className="w-32 aspect-video rounded-xl overflow-hidden relative flex-shrink-0">
                    <img src={item.cover} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                 </div>
                 <div className="flex-1 flex flex-col justify-center">
                   <h4 className="text-sm font-bold line-clamp-2 mb-1 group-hover:text-primary-400 transition">{item.title}</h4>
                   <p className="text-xs text-purple-400">{item.views}次观看</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

// 按钮小组件 (保持不变)
const ActionButton = ({ active, onClick, icon, label, activeColor = "text-primary-500" }: any) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300
      ${active 
        ? `${activeColor} shadow-lg shadow-current/10 font-bold scale-105` 
        : 'bg-planet-card/50 text-purple-200 hover:bg-purple-700/50 hover:text-white'}
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default VideoDetailPage;
