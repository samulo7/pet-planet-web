import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookHeart,
  CalendarDays,
  Compass,
  Image as ImageIcon,
  MessageCircle,
  PawPrint,
  PlayCircle,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

import { experienceAPI } from '@/api/experience';
import { imageAPI } from '@/api/image';
import { videoAPI } from '@/api/video';
import type { ExperiencePost, PetImage, Video } from '@/types/entity';
import { resolveAssetUrl } from '@/utils/asset';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<PetImage[]>([]);
  const [posts, setPosts] = useState<ExperiencePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError('');

        const [videoRes, imageRes, postRes] = await Promise.all([
          videoAPI.getVideoList({ page: 1, page_size: 9 }),
          imageAPI.getImageList({ page: 1, page_size: 8 }),
          experienceAPI.getExperienceList({ page: 1, page_size: 6 }),
        ]);

        setVideos(videoRes.list || []);
        setImages(imageRes.list || []);
        setPosts(postRes.list || []);
      } catch (err: any) {
        setError(err?.message || '首页数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    void loadHomeData();
  }, []);

  const featuredVideo = videos[0];
  const videoList = videos.slice(1, 7);
  const featuredPosts = posts.slice(0, 3);
  const gallery = images.slice(0, 8);

  const quickStats = useMemo(
    () => [
      { label: '本周新视频', value: videos.length, icon: <PlayCircle size={16} /> },
      { label: '经验帖子', value: posts.length, icon: <BookHeart size={16} /> },
      { label: '灵感图集', value: images.length, icon: <ImageIcon size={16} /> },
    ],
    [images.length, posts.length, videos.length],
  );

  return (
    <div className="relative px-1 pb-14 pt-6 md:px-2 md:pt-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-8 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-cyan-200/45 blur-[120px]" />
        <div className="absolute -top-14 right-1/4 h-64 w-64 rounded-full bg-sky-300/35 blur-[90px]" />
        <div className="absolute bottom-0 left-16 h-56 w-56 rounded-full bg-blue-200/30 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-100/70 bg-gradient-to-br from-[#d3f4ff] via-[#9edbff] to-[#6bbaff] p-6 shadow-[0_30px_80px_-35px_rgba(29,125,196,0.55)] md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full border border-white/35" />
            <div className="absolute -bottom-20 right-4 h-52 w-52 rounded-full bg-white/25 blur-2xl" />
            <div className="absolute left-8 top-10 h-3 w-3 rounded-full bg-white/85" />
            <div className="absolute left-[40%] top-16 h-2 w-2 rounded-full bg-cyan-50/95" />
            <div className="absolute right-16 top-20 h-2 w-2 rounded-full bg-white/95" />
            <div className="absolute bottom-16 left-[46%] h-2.5 w-2.5 rounded-full bg-cyan-50/95" />
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/55 px-4 py-1.5 text-xs font-semibold text-cyan-700">
                <Sparkles size={14} />
                宠物宇宙站点
              </p>
              <h1 className="text-3xl font-black leading-tight text-cyan-950 md:text-5xl">
                欢迎来到宠物星球
                <br />
                记录每一份可爱日常
              </h1>
              <p className="max-w-xl text-sm leading-7 text-cyan-900/85 md:text-base">
                在这里上传视频、分享养宠经验、收藏灵感图片，让你的宠物内容像小行星一样不断扩散。
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_-15px_rgba(8,145,178,0.95)] transition hover:-translate-y-0.5 hover:bg-cyan-600"
                >
                  <UploadCloud size={16} />
                  上传视频
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white/75 px-5 py-2.5 text-sm font-semibold text-cyan-900 transition hover:bg-white"
                >
                  进入经验社区
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickStats.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-2xl border border-cyan-100 bg-white/60 p-3 backdrop-blur-sm"
                  >
                    <p className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700">
                      {item.icon}
                      {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-black text-cyan-950">{item.value}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="pointer-events-none absolute left-6 top-4 h-16 w-28 rounded-full bg-white/40 blur-xl" />
              <div className="relative aspect-square rounded-full bg-gradient-to-b from-[#79d4ff] via-[#4fb8f5] to-[#3f86d8] p-6 shadow-[0_30px_55px_-28px_rgba(12,81,161,0.85)]">
                <div className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
                <div className="absolute left-1/2 top-[45%] h-[62%] w-[78%] -translate-x-1/2 rounded-[45%] border-4 border-cyan-100/70 bg-gradient-to-b from-[#94ecff] via-[#6ed3ff] to-[#2d8fd8]" />
                <div className="absolute left-1/2 top-[34%] h-[34%] w-[64%] -translate-x-1/2 rounded-[40%] border border-white/85 bg-white/35 backdrop-blur-sm" />

                <div className="absolute right-4 top-8 rounded-full border border-white/70 bg-white/70 p-2 text-cyan-700">
                  <PawPrint size={16} />
                </div>
                <div className="absolute left-3 top-20 rounded-full border border-white/70 bg-white/70 p-2 text-cyan-700">
                  <Sparkles size={16} />
                </div>
                <div className="absolute bottom-8 left-6 rounded-full border border-white/70 bg-white/70 p-2 text-cyan-700">
                  <BookHeart size={16} />
                </div>
                <div className="absolute bottom-7 right-8 rounded-full border border-white/70 bg-white/70 p-2 text-cyan-700">
                  <PlayCircle size={16} />
                </div>
              </div>
              <div className="absolute -left-6 top-10 rounded-2xl border border-cyan-200 bg-white/80 px-3 py-2 text-xs font-semibold text-cyan-700 shadow-lg">
                浮岛故事
              </div>
              <div className="absolute -right-5 bottom-12 rounded-2xl border border-cyan-200 bg-white/80 px-3 py-2 text-xs font-semibold text-cyan-700 shadow-lg">
                萌宠日记
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="lg:col-span-2 rounded-[2rem] border border-cyan-100 bg-white/75 p-5 shadow-[0_25px_60px_-40px_rgba(22,98,170,0.65)] backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-cyan-950">
                <PlayCircle size={18} />
                热门视频
              </h2>
              <button
                onClick={() => navigate('/')}
                className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                查看更多
              </button>
            </div>

            {loading ? (
              <div className="grid gap-3 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-52 animate-pulse rounded-2xl bg-cyan-100" />
                ))}
              </div>
            ) : featuredVideo ? (
              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/video/${featuredVideo.id}`)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50 text-left"
                >
                  <div className="aspect-[16/7] bg-cyan-100/70">
                    {resolveAssetUrl(featuredVideo.cover_url) ? (
                      <img
                        src={resolveAssetUrl(featuredVideo.cover_url) || ''}
                        alt={featuredVideo.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-cyan-700">
                        封面生成中
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="line-clamp-1 text-base font-bold md:text-lg">{featuredVideo.title}</p>
                    <p className="mt-1 text-xs text-cyan-50/90">{featuredVideo.view_count || 0} 次观看</p>
                  </div>
                </button>

                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {videoList.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => navigate(`/video/${video.id}`)}
                      className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-3 text-left transition hover:-translate-y-0.5 hover:bg-cyan-100/80"
                    >
                      <p className="line-clamp-1 text-sm font-semibold text-cyan-900">{video.title}</p>
                      <p className="mt-1 text-xs text-cyan-700/80">{video.view_count || 0} 次观看</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 p-10 text-center text-cyan-700">
                暂无视频内容
              </div>
            )}
          </article>

          <article className="rounded-[2rem] border border-cyan-100 bg-white/75 p-5 shadow-[0_25px_60px_-40px_rgba(22,98,170,0.65)] backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-cyan-950">
                <BookHeart size={18} />
                经验精选
              </h2>
              <button
                onClick={() => navigate('/community')}
                className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                全部帖子
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-24 animate-pulse rounded-2xl bg-cyan-100" />
                ))}
              </div>
            ) : featuredPosts.length > 0 ? (
              <div className="space-y-3">
                {featuredPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => navigate(`/experience/${post.id}`)}
                    className="w-full rounded-2xl border border-cyan-100 bg-cyan-50/80 p-3 text-left transition hover:-translate-y-0.5 hover:bg-cyan-100/80"
                  >
                    <p className="line-clamp-1 text-sm font-semibold text-cyan-900">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-cyan-700/85">{post.content}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-cyan-700/80">
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={12} />
                        {post.comment_count ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} />
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 p-8 text-center text-cyan-700">
                暂无经验内容
              </div>
            )}
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          <article className="lg:col-span-3 rounded-[2rem] border border-cyan-100 bg-white/75 p-5 shadow-[0_25px_60px_-40px_rgba(22,98,170,0.65)] backdrop-blur-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-cyan-950">
                <ImageIcon size={18} />
                灵感图廊
              </h2>
              <button
                onClick={() => navigate('/community')}
                className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                看更多内容
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="aspect-square animate-pulse rounded-2xl bg-cyan-100" />
                ))}
              </div>
            ) : gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50"
                  >
                    <img
                      src={resolveAssetUrl(img.image_url) || img.image_url}
                      alt={img.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50 p-10 text-center text-cyan-700">
                暂无图片内容
              </div>
            )}
          </article>

          <article className="rounded-[2rem] border border-cyan-100 bg-white/75 p-5 shadow-[0_25px_60px_-40px_rgba(22,98,170,0.65)] backdrop-blur-sm md:p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-cyan-950">
              <Compass size={18} />
              快捷入口
            </h2>
            <div className="mt-4 space-y-3">
              <QuickAction label="发布视频" desc="上传后自动处理封面和播放地址" onClick={() => navigate('/upload')} />
              <QuickAction label="经验社区" desc="发帖、互动、沉淀养宠知识库" onClick={() => navigate('/community')} />
              <QuickAction label="我的主页" desc="管理你的视频和经验内容" onClick={() => navigate('/user/me')} />
            </div>
          </article>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
};

type QuickActionProps = {
  label: string;
  desc: string;
  onClick: () => void;
};

const QuickAction: React.FC<QuickActionProps> = ({ label, desc, onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-2xl border border-cyan-100 bg-cyan-50/85 p-3 text-left transition hover:-translate-y-0.5 hover:bg-cyan-100"
  >
    <p className="text-sm font-semibold text-cyan-900">{label}</p>
    <p className="mt-1 text-xs text-cyan-700/80">{desc}</p>
  </button>
);

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN');
}

export default HomePage;
