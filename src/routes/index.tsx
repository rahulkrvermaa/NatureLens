import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/common/Skeleton';

// Code-split route components
const HomePage = lazy(() => import('@/pages/public/HomePage').then((m) => ({ default: m.HomePage })));
const ExplorePage = lazy(() => import('@/pages/public/ExplorePage').then((m) => ({ default: m.ExplorePage })));
const CategoriesPage = lazy(() => import('@/pages/public/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import('@/pages/public/CategoryDetailPage').then((m) => ({ default: m.CategoryDetailPage })));
const PhotoDetailPage = lazy(() => import('@/pages/public/PhotoDetailPage').then((m) => ({ default: m.PhotoDetailPage })));
const ChallengesPage = lazy(() => import('@/pages/public/ChallengesPage').then((m) => ({ default: m.ChallengesPage })));
const ChallengeDetailPage = lazy(() => import('@/pages/public/ChallengeDetailPage').then((m) => ({ default: m.ChallengeDetailPage })));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage').then((m) => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const UploadPage = lazy(() => import('@/pages/upload/UploadPage').then((m) => ({ default: m.UploadPage })));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="space-y-4 w-72 text-center">
      <Skeleton className="h-48 w-full" rounded="lg" />
      <Skeleton className="h-6 w-3/4 mx-auto" rounded="md" />
      <Skeleton className="h-4 w-1/2 mx-auto" rounded="md" />
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'explore',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExplorePage />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        path: 'category/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoryDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'photo/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PhotoDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'profile/:username',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: ':username',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'challenges',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChallengesPage />
          </Suspense>
        ),
      },
      {
        path: 'challenges/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ChallengeDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignupPage />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: 'upload',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UploadPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
