import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from '@/context/ToastContext';
import { UploadPage } from '@/pages/upload/UploadPage';
import { PhotoDetailPage } from '@/pages/public/PhotoDetailPage';
import { ChallengeDetailPage } from '@/pages/public/ChallengeDetailPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { useNatureStore } from '@/store/useNatureStore';
import { DEMO_CHALLENGES, DEMO_PHOTOS, DEMO_PROFILES } from '@/lib/mockData';

describe('Interactive & Submit Features', () => {
  beforeEach(() => {
    useNatureStore.setState({
      dbConnected: false,
      photos: DEMO_PHOTOS,
      challenges: DEMO_CHALLENGES,
      currentUser: null,
      enteredChallengeIds: [],
      likedPhotoIds: [],
      savedPhotoIds: [],
    });
  });

  it('UploadPage publishes a new photo into the live store when signed in', async () => {
    useNatureStore.setState({ currentUser: DEMO_PROFILES[0] });
    const initialCount = useNatureStore.getState().photos.length;

    render(
      <MemoryRouter>
        <ToastProvider>
          <UploadPage />
        </ToastProvider>
      </MemoryRouter>
    );

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    const mockFile = new File(['dummy-image-bytes'], 'snow-peak.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await screen.findByAltText('Upload preview');

    const titleInput = screen.getByPlaceholderText(/Alpenglow Over Tre Cime/i);
    fireEvent.change(titleInput, { target: { value: 'Glacier Ridge Sunrise' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Publish to NatureLens/i })).not.toBeDisabled();
    });

    fireEvent.submit(titleInput.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Published Live to NatureLens/i)).toBeInTheDocument();
    });

    const updatedPhotos = useNatureStore.getState().photos;
    expect(updatedPhotos.length).toBe(initialCount + 1);
    expect(updatedPhotos[0].title).toBe('Glacier Ridge Sunrise');
  });

  it('PhotoDetailPage posts a new comment in real time', () => {
    render(
      <MemoryRouter initialEntries={['/photo/ph-1']}>
        <ToastProvider>
          <Routes>
            <Route path="/photo/:id" element={<PhotoDetailPage />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );

    const commentInput = screen.getByPlaceholderText(/Share constructive critique/i);
    fireEvent.change(commentInput, { target: { value: 'Incredible aurora framing!' } });
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));

    expect(screen.getByText('Incredible aurora framing!')).toBeInTheDocument();
  });

  it('ChallengeDetailPage submits a photo entry and increments entries count', () => {
    const initialEntries = useNatureStore.getState().challenges[0].entries_count;

    render(
      <MemoryRouter initialEntries={['/challenges/the-golden-hour-odyssey']}>
        <ToastProvider>
          <Routes>
            <Route path="/challenges/:slug" element={<ChallengeDetailPage />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Enter Selected Photograph/i }));

    expect(screen.getByText(/Entry Confirmed/i)).toBeInTheDocument();
    expect(useNatureStore.getState().challenges[0].entries_count).toBe(initialEntries + 1);
  });

  it('LoginPage signs in a user into the live store', async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <LoginPage />
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/elena_frost@naturelens.com/i), {
      target: { value: 'elena_frost@naturelens.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(useNatureStore.getState().currentUser).not.toBeNull();
    });
    expect(useNatureStore.getState().currentUser?.username).toBe('elena_frost');
  });

  it('redirects unauthenticated user to /signup when trying to submit or download', async () => {
    render(
      <MemoryRouter initialEntries={['/upload']}>
        <ToastProvider>
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/signup" element={<div>Signup Gate Page</div>} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    const mockFile = new File(['dummy-image-bytes'], 'peak.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await screen.findByAltText('Upload preview');

    const titleInput = screen.getByPlaceholderText(/Alpenglow Over Tre Cime/i);
    fireEvent.change(titleInput, { target: { value: 'Unauth Photo' } });
    fireEvent.submit(titleInput.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Signup Gate Page')).toBeInTheDocument();
    });

    const handleClose = () => {};
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <ToastProvider>
          <Routes>
            <Route
              path="/explore"
              element={<PhotoDownloadModal photo={DEMO_PHOTOS[0]} isOpen={true} onClose={handleClose} />}
            />
            <Route path="/signup" element={<div>Download Signup Redirect</div>} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Download High-Resolution Image/i }));
    await waitFor(() => {
      expect(screen.getByText('Download Signup Redirect')).toBeInTheDocument();
    });
  });
});
