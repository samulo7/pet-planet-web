import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import CommunityPage from '@/pages/Community';
import ExperienceDetailPage from '@/pages/ExperienceDetail';
import HomePage from '@/pages/Home';
import UploadPage from '@/pages/Upload';
import UserProfilePage from '@/pages/UserProfile';
import VideoDetailPage from '@/pages/VideoDetail';

const ErrorPage = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
    <h1 className="text-4xl font-bold text-primary-500 mb-4">页面不存在</h1>
    <p className="text-gray-600 mb-6">你访问的页面不存在或已被移动。</p>
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
      { index: true, element: <HomePage /> },
      { path: 'u/:id', element: <UserProfilePage /> },
      { path: 'user/:id', element: <UserProfilePage /> },
      { path: 'video/:id', element: <VideoDetailPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'experience/:id', element: <ExperienceDetailPage /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);
