import { describe, it, expect, beforeEach } from 'vitest';
import { useNatureStore } from '@/store/useNatureStore';

describe('useNatureStore real-time actions', () => {
  beforeEach(() => {
    useNatureStore.setState({
      likedPhotoIds: [],
      savedPhotoIds: [],
      followedUserIds: [],
      enteredChallengeIds: [],
      theme: 'light',
      currentUser: null,
    });
  });

  it('toggles photo likes and updates count in real time', () => {
    const initialPhoto = useNatureStore.getState().photos[0];
    const initialLikes = initialPhoto.likes_count;

    const liked = useNatureStore.getState().toggleLike(initialPhoto.id);
    expect(liked).toBe(true);
    expect(useNatureStore.getState().photos[0].likes_count).toBe(initialLikes + 1);

    const unliked = useNatureStore.getState().toggleLike(initialPhoto.id);
    expect(unliked).toBe(false);
    expect(useNatureStore.getState().photos[0].likes_count).toBe(initialLikes);
  });

  it('publishes a new photo and adds it to the live gallery', () => {
    const beforeCount = useNatureStore.getState().photos.length;
    const created = useNatureStore.getState().addPhoto({
      title: 'Alpine Dawn',
      description: 'First light over the ridge.',
      categoryId: 'cat-1',
      displayUrl: 'https://example.com/alpine.jpg',
      width: 2400,
      height: 1600,
      fileSizeBytes: 1200000,
      mimeType: 'image/jpeg',
    });

    const state = useNatureStore.getState();
    expect(state.photos.length).toBe(beforeCount + 1);
    expect(state.photos[0].id).toBe(created.id);
    expect(state.photos[0].title).toBe('Alpine Dawn');
  });

  it('adds real-time comments and increments comment count', () => {
    const photo = useNatureStore.getState().photos[0];
    const prevComments = photo.comments_count;

    const comment = useNatureStore.getState().addComment(photo.id, 'Stunning light!');
    expect(comment.content).toBe('Stunning light!');
    expect(useNatureStore.getState().photos[0].comments_count).toBe(prevComments + 1);
  });

  it('toggles theme between light and dark', () => {
    expect(useNatureStore.getState().theme).toBe('light');
    useNatureStore.getState().toggleTheme();
    expect(useNatureStore.getState().theme).toBe('dark');
  });
});
