import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock3, Eye, MessageCircle, Plus, RefreshCw, Tag, Trash2, X } from 'lucide-react';

import { experienceAPI } from '@/api/experience';
import { useAuthStore } from '@/store/useAuthStore';
import type { ExperiencePost } from '@/types/entity';
import { resolveAssetUrl } from '@/utils/asset';

const PAGE_SIZE = 20;

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openLoginModal } = useAuthStore();

  const [posts, setPosts] = useState<ExperiencePost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [showComposer, setShowComposer] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');

  const categoryOptions = useMemo(() => {
    const cleaned = categories.filter((x) => x && x.trim().length > 0);
    return ['all', ...cleaned];
  }, [categories]);

  const loadCategories = async () => {
    try {
      const data = await experienceAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  };

  const loadPosts = async (selectedCategory: string) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: 1,
        page_size: PAGE_SIZE,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      };
      const res = await experienceAPI.getExperienceList(params);
      setPosts(res.list || []);
    } catch (err: any) {
      const message = err?.message || '加载社区内容失败';
      setError(message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadPosts(activeCategory);
  }, [activeCategory]);

  const parseTags = (raw: string): string[] => {
    if (!raw.trim()) return [];
    return Array.from(new Set(raw.split(',').map((x) => x.trim()).filter(Boolean)));
  };

  const resetComposer = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setCoverImage('');
    setTagsInput('');
  };

  const handlePublishClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setShowComposer((v) => !v);
  };

  const handleCreate = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await experienceAPI.createExperience({
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || undefined,
        cover_image: coverImage.trim() || undefined,
        tags: parseTags(tagsInput),
      });

      resetComposer();
      setShowComposer(false);
      await Promise.all([loadCategories(), loadPosts(activeCategory)]);
    } catch (err: any) {
      setError(err?.message || '发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    if (!window.confirm('确认删除这条经验吗？')) return;

    setDeletingId(postId);
    setError('');
    try {
      await experienceAPI.deleteExperience(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err: any) {
      setError(err?.message || '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <section className="rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-6 md:p-8 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                <BookOpen size={28} /> 经验社区
              </h1>
              <p className="mt-2 text-emerald-50/90 text-sm md:text-base">
                分享真实养猫经验，查看大家的喂养记录与踩坑总结。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePublishClick}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-semibold transition"
              >
                {showComposer ? <X size={16} /> : <Plus size={16} />} 发布
              </button>
              <button
                onClick={() => void loadPosts(activeCategory)}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-semibold transition"
              >
                <RefreshCw size={16} /> 刷新
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-slate-200 p-3 md:p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((item) => {
              const active = activeCategory === item;
              const label = item === 'all' ? '全部' : item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveCategory(item)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {showComposer ? (
          <section className="rounded-2xl bg-white border border-slate-200 p-4 md:p-5 shadow-sm space-y-3">
            <h2 className="text-base font-bold">发布经验</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="标题"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="内容"
              className="w-full min-h-28 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="分类（可选）"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="封面图片 URL（可选）"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="标签（逗号分隔，可选）"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  resetComposer();
                  setShowComposer(false);
                }}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 transition"
              >
                取消
              </button>
              <button
                onClick={() => void handleCreate()}
                disabled={submitting}
                className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60 transition"
              >
                {submitting ? '发布中...' : '发布'}
              </button>
            </div>
          </section>
        ) : null}

        {error ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm">
            {error}
          </section>
        ) : null}

        {loading ? (
          <section className="space-y-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </section>
        ) : null}

        {!loading && !error && posts.length === 0 ? (
          <section className="rounded-2xl bg-white border border-slate-200 p-10 text-center text-slate-500">
            当前分类下还没有内容
          </section>
        ) : null}

        {!loading && posts.length > 0 ? (
          <section className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => navigate(`/experience/${post.id}`)}
                canDelete={Boolean(user?.id && user.id === post.user_id)}
                deleting={deletingId === post.id}
                onDelete={() => void handleDelete(post.id)}
              />
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
};

type PostCardProps = {
  post: ExperiencePost;
  onClick: () => void;
  canDelete: boolean;
  deleting: boolean;
  onDelete: () => void;
};

const PostCard: React.FC<PostCardProps> = ({ post, onClick, canDelete, deleting, onDelete }) => {
  const previewImages = getPreviewImages(post).slice(0, 3);
  const avatar = resolveAssetUrl(post.user?.avatar) || 'https://placehold.co/80x80?text=U';

  return (
    <article
      onClick={onClick}
      className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 md:p-5 cursor-pointer hover:shadow-md transition"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={avatar}
            alt={post.user?.nickname || 'user'}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{post.user?.nickname || '匿名用户'}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock3 size={12} /> {formatDate(post.created_at)}
            </p>
          </div>
        </div>
        {post.category ? (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {post.category}
          </span>
        ) : null}
      </header>

      <h2 className="mt-4 text-base md:text-lg font-bold text-slate-900 line-clamp-2">{post.title}</h2>
      <p className="mt-2 text-sm text-slate-600 leading-6 line-clamp-3">{post.content}</p>

      {previewImages.length > 0 ? (
        <div className={`mt-4 grid gap-2 ${previewImages.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {previewImages.map((url, idx) => (
            <div key={`${post.id}-${idx}`} className="aspect-video rounded-xl overflow-hidden bg-slate-100">
              <img src={url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      {post.tags && post.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((item) => (
            <span
              key={`${post.id}-${item}`}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-xs"
            >
              <Tag size={12} /> {item}
            </span>
          ))}
        </div>
      ) : null}

      <footer className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Eye size={14} /> {post.view_count}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle size={14} /> {post.comment_count}
        </span>
        {canDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center gap-1 ml-auto text-red-600 hover:text-red-700 transition"
          >
            <Trash2 size={14} /> {deleting ? '删除中...' : '删除'}
          </button>
        ) : null}
      </footer>
    </article>
  );
};

function getPreviewImages(post: ExperiencePost): string[] {
  const urls: string[] = [];
  const cover = resolveAssetUrl(post.cover_image);
  if (cover) {
    urls.push(cover);
  }

  const mediaUrls = (post.media || [])
    .filter((m) => m.media_url)
    .map((m) => resolveAssetUrl(m.media_url))
    .filter((x): x is string => Boolean(x));

  for (const url of mediaUrls) {
    if (!urls.includes(url)) {
      urls.push(url);
    }
  }

  return urls;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default CommunityPage;
