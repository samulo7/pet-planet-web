import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/Home';
import UserProfilePage from '@/pages/UserProfile'; 
import VideoDetailPage from '@/pages/VideoDetail';
import CommunityPage from '@/pages/Community';


// 临时占位组件 (Login 和 Upload 还没写)const TempLogin = () => <div className="p-10 text-center">登录页开发中...</div>;
// const TempUpload = () => <div className="p-10 text-center">上传页开发中...</div>;
// const TempVideoDetail = () => <div className="p-10 text-center">视频详情页开发中...</div>;
const ErrorPage = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
    <h1 className="text-4xl font-bold text-primary-500 mb-4">哎呀！出错了 🐾</h1>
    <p className="text-gray-600 mb-6">页面遇到了一个小问题，或者找不到该页面。</p>
    <a href="/" className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition">
      返回首页
    </a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'u/:id',
        element: <UserProfilePage />,
      },
      {
        path: 'video/:id',
        element: <VideoDetailPage />, 
      },
      {
        path: 'upload',
        element: <VideoDetailPage />, 
      },
      {
        path: 'community',
        element: <CommunityPage />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      }
    ],
  },
 
]);