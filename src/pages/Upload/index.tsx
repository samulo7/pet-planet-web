import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudUpload, FileVideo, Loader2, Sparkles, Upload } from 'lucide-react';
import { videoAPI } from '@/api/video';
import { useAuthStore } from '@/store/useAuthStore';
import type { Video } from '@/types/entity';

const MAX_FILE_SIZE_MB = 500;

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuthStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<Video | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted'>('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      size: formatBytes(file.size),
      type: file.type || 'video',
    };
  }, [file]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const resetUploadState = () => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedVideo(null);
    setPublishMessage('');
    setErrorMessage('');
  };

  const handlePickFile = () => {
    if (!inputRef.current) return;
    // Reset to allow selecting the same file twice in a row.
    inputRef.current.value = '';
    inputRef.current.click();
  };

  const handleFile = (nextFile: File) => {
    if (!nextFile.type.startsWith('video/')) {
      setErrorMessage('请上传视频文件（mp4/mov/webm 等）');
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`视频大小不能超过 ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setErrorMessage('');
    setFile(nextFile);
    resetUploadState();

    if (!title.trim()) {
      setTitle(stripFileExtension(nextFile.name));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    handleFile(nextFile);
    event.currentTarget.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const nextFile = event.dataTransfer.files?.[0];
    if (!nextFile) return;
    handleFile(nextFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('请先选择视频文件');
      return;
    }
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setErrorMessage('');
    setIsUploading(true);
    setUploadProgress(0);
    setPublishMessage('');

    try {
      const res = await videoAPI.uploadVideo(file, {
        onProgress: (percent) => setUploadProgress(percent),
      });
      const normalized =
        (res as any)?.data?.data ??
        (res as any)?.data ??
        (res as any)?.video ??
        (res as any)?.result ??
        res;
      if (!normalized || typeof (normalized as any).id === 'undefined') {
        setErrorMessage('上传成功但未返回视频信息，请联系后端确认响应格式');
        setUploadProgress(100);
        return;
      }
      setUploadedVideo(normalized as Video);
      setUploadProgress(100);
    } catch (error: any) {
      console.error('上传失败:', error);
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        '上传失败，请稍后重试';
      setErrorMessage(serverMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!uploadedVideo) {
      setErrorMessage('请先上传视频文件');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('请输入视频标题');
      return;
    }
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setIsPublishing(true);
    setErrorMessage('');
    setPublishMessage('');

    try {
      await videoAPI.publishVideo(uploadedVideo.id, {
        title: title.trim(),
        description: description.trim(),
      });
      setPublishMessage('发布成功，正在为你跳转...');
      setTimeout(() => {
        navigate(`/video/${uploadedVideo.id}`);
      }, 800);
    } catch (error) {
      console.error('发布失败:', error);
      setErrorMessage('发布失败，请检查内容后重试');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white p-6 md:p-10 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[140px]"></div>
      <div className="absolute -bottom-32 right-[-5%] h-[520px] w-[520px] rounded-full bg-orange-500/10 blur-[160px]"></div>

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orange-300/70">Pet Planet Studio</p>
            <h1 className="text-3xl md:text-4xl font-black mt-2">个人视频上传</h1>
            <p className="text-sm text-purple-200/80 mt-2">
              上传你的萌宠瞬间，给星球带来新的能量。
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-purple-200/70">
            <Sparkles size={16} className="text-orange-300" />
            仅支持视频文件，最大 {MAX_FILE_SIZE_MB}MB
          </div>
        </header>

        {!isAuthenticated && (
          <div className="rounded-3xl border border-orange-500/30 bg-orange-500/10 p-5 text-sm text-orange-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>登录后才能上传与发布视频。</span>
            <button
              onClick={openLoginModal}
              className="rounded-full bg-orange-500 px-5 py-2 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-400 transition"
            >
              立即登录
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <div
              onClick={handlePickFile}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 rounded-[1.75rem] border-2 border-dashed p-8 text-center transition ${
                isDragging ? 'border-orange-400 bg-orange-500/10' : 'border-white/15 bg-black/20'
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-300">
                <CloudUpload size={30} />
              </div>
              <div>
                <p className="text-lg font-semibold">拖拽视频到这里上传</p>
                <p className="text-sm text-purple-200/70 mt-1">
                  或点击选择本地文件（mp4 / mov / webm）
                </p>
              </div>
              <button
                className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-black hover:bg-white transition"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePickFile();
                }}
                type="button"
              >
                选择视频文件
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-200">
                    <FileVideo size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{fileMeta?.name || '未选择文件'}</p>
                    <p className="text-xs text-purple-200/60">
                      {fileMeta ? `${fileMeta.size} · ${fileMeta.type}` : '支持 1080p/4K 视频'}
                    </p>
                  </div>
                </div>
                {file && (
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-purple-200/70 hover:text-white transition"
                  >
                    重新选择
                  </button>
                )}
              </div>

              {previewUrl ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <video
                    src={previewUrl}
                    className="h-56 w-full rounded-xl object-cover"
                    controls
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-purple-200/60">
                  上传完成后可以预览视频画面。
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-purple-200/70">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {isUploading ? '上传中...' : uploadedVideo ? '重新上传' : '开始上传'}
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-4">发布设置</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-purple-200/70">视频标题</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-purple-200/40 focus:border-orange-500/60 focus:outline-none"
                  placeholder="比如：猫咪的星际下午茶"
                />
              </div>
              <div>
                <label className="text-xs text-purple-200/70">视频描述</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-purple-200/40 focus:border-orange-500/60 focus:outline-none"
                  placeholder="补充一些有趣的背景或故事..."
                />
              </div>
              <div>
                <label className="text-xs text-purple-200/70">可见性</label>
                <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                  {(['public', 'unlisted'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setVisibility(option)}
                      className={`rounded-2xl border px-4 py-3 font-semibold transition ${
                        visibility === option
                          ? 'border-orange-400 bg-orange-500/20 text-orange-100'
                          : 'border-white/10 bg-black/30 text-purple-200/60 hover:border-orange-500/40'
                      }`}
                    >
                      {option === 'public' ? '公开' : '仅限链接'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-purple-200/70">
              {uploadedVideo ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
                  视频已上传成功，可以设置标题并发布。
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  上传完成后即可发布。
                </div>
              )}
              {errorMessage ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
                  {errorMessage}
                </div>
              ) : null}
              {publishMessage ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
                  {publishMessage}
                </div>
              ) : null}
            </div>

            <button
              onClick={handlePublish}
              disabled={!uploadedVideo || isPublishing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPublishing ? <Loader2 size={18} className="animate-spin" /> : '发布视频'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const stripFileExtension = (filename: string) => filename.replace(/\.[^/.]+$/, '');

export default UploadPage;
