import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Eye, MessageCircle, Tag } from 'lucide-react';

import { experienceAPI } from '@/api/experience';
import type { ExperiencePost } from '@/types/entity';
import { resolveAssetUrl } from '@/utils/asset';

const ExperienceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<ExperiencePost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setError('无效的帖子 ID');
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await experienceAPI.getExperienceDetail(id);
        setPost(data);
      } catch (err: any) {
        const message = err?.message || '加载经验详情失败';
        setError(message);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [id]);

  const mediaUrls = useMemo(() => {
    if (!post) return [];
    return (post.media || [])
      .filter((item) => item.media_url)
      .map((item) => ({
        type: item.media_type,
        url: resolveAssetUrl(item.media_url) || item.media_url || '',
      }))
      .filter((item) => Boolean(item.url));
  }, [post]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">加载中...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p>{error}</p>
          <button
            onClick={() => navigate('/community')}
            className="mt-4 rounded-full bg-red-600 text-white px-4 py-2 text-sm"
          >
            返回社区
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const avatar = resolveAssetUrl(post.user?.avatar) || 'https://placehold.co/80x80?text=U';
  const cover = resolveAssetUrl(post.cover_image);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100 transition"
        >
          <ArrowLeft size={16} /> 返回
        </button>

        <article className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {cover ? (
            <div className="aspect-[16/6] bg-slate-100">
              <img src={cover} alt={post.title} className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="p-5 md:p-7">
            <header className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={avatar} alt={post.user?.nickname || 'user'} className="w-11 h-11 rounded-full object-cover border" />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{post.user?.nickname || '匿名用户'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock3 size={12} /> {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
                {post.category ? (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-2.5 py-1">
                    {post.category}
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-900">{post.title}</h1>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><Eye size={14} /> {post.view_count}</span>
                <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {post.comment_count}</span>
              </div>

              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-xs">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <section className="mt-6 text-slate-700 leading-7 whitespace-pre-wrap">{post.content}</section>

            {mediaUrls.length > 0 ? (
              <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {mediaUrls.map((media, idx) => (
                  <div key={`${media.url}-${idx}`} className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    {media.type === 2 ? (
                      <video src={media.url} controls className="w-full h-64 object-cover" />
                    ) : (
                      <img src={media.url} alt={post.title} className="w-full h-64 object-cover" />
                    )}
                  </div>
                ))}
              </section>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export default ExperienceDetailPage;
