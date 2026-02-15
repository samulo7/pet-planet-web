import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Image as ImageIcon, Play, UserPlus } from 'lucide-react';

import { experienceAPI } from '@/api/experience';
import { imageAPI } from '@/api/image';
import { userAPI } from '@/api/user';
import { videoAPI } from '@/api/video';
import type { ExperiencePost, PetImage, User, Video } from '@/types/entity';
import { resolveAssetUrl } from '@/utils/asset';

type TabType = 'video' | 'image' | 'post';

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<PetImage[]>([]);
  const [posts, setPosts] = useState<ExperiencePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const targetId = id;
    if (!targetId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const profile = await userAPI.getUserProfile(targetId);
        setUserInfo(profile as User);

        const [videoRes, imageRes, postRes] = await Promise.allSettled([
          videoAPI.getVideoList({ page: 1, page_size: 20, user_id: targetId }),
          imageAPI.getImageList({ page: 1, page_size: 20, user_id: targetId }),
          experienceAPI.getExperienceList({ page: 1, page_size: 20, user_id: targetId }),
        ]);

        if (videoRes.status === 'fulfilled') {
          setVideos(videoRes.value.list || []);
        } else {
          setVideos([]);
        }

        if (imageRes.status === 'fulfilled') {
          setImages(imageRes.value.list || []);
        } else {
          setImages([]);
        }

        if (postRes.status === 'fulfilled') {
          setPosts(postRes.value.list || []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('[UserProfile] load failed', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">加载中...</div>;
  }

  if (!userInfo) {
    return <div className="text-center mt-20 text-gray-500">用户不存在</div>;
  }

  const fallbackAvatar = 'https://placehold.co/150x150?text=U';
  const avatarUrl = resolveAssetUrl(userInfo.avatar) || fallbackAvatar;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto pt-8 pb-6 px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={avatarUrl}
              alt={userInfo.nickname}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackAvatar;
              }}
            />

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{userInfo.nickname}</h1>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">ID: {userInfo.username}</span>
              </div>

              <p className="text-gray-600 max-w-lg mx-auto md:mx-0 text-sm leading-relaxed">
                {userInfo.bio || '这个人很懒，什么也没写~'}
              </p>

              <div className="flex justify-center md:justify-start gap-8">
                <StatItem label="粉丝" value={userInfo.follower_count} />
                <StatItem label="关注" value={userInfo.following_count} />
                <StatItem label="信誉" value={userInfo.reputation_score} />
              </div>

              <div className="flex justify-center md:justify-start gap-3 pt-2">
                <button className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium transition shadow-sm shadow-primary-500/30">
                  <UserPlus size={16} /> 关注
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            label="图片"
            count={images.length}
          />
          <TabButton
            active={activeTab === 'post'}
            onClick={() => setActiveTab('post')}
            icon={<BookOpen size={18} />}
            label="经验"
            count={posts.length}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'video' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group relative cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <div className="aspect-[3/4] md:aspect-[16/9] relative bg-gray-100">
                  {resolveAssetUrl(video.cover_url) ? (
                    <img src={resolveAssetUrl(video.cover_url)} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">封面生成中</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 leading-snug">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'image' && (
          <div className="columns-2 md:columns-4 gap-4 space-y-4">
            {images.map((img) => (
              <div key={img.id} className="relative rounded-xl overflow-hidden break-inside-avoid bg-white shadow-sm">
                <img src={img.image_url} alt={img.title} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'post' && (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/experience/${post.id}`)}
                className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{post.title}</h3>
                  {post.category ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {post.category}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.content}</p>
                <p className="mt-2 text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {((activeTab === 'video' && videos.length === 0) ||
          (activeTab === 'image' && images.length === 0) ||
          (activeTab === 'post' && posts.length === 0)) && (
          <div className="text-center py-20 text-gray-400">暂无内容</div>
        )}
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <div className="text-center">
    <span className="block font-bold text-lg text-gray-900">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

const TabButton = ({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-all duration-200 ${
      active ? 'border-primary-500 text-primary-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
    <span className={`text-xs ${active ? 'text-primary-400' : 'text-gray-300'}`}>{count}</span>
  </button>
);

export default UserProfilePage;
