import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes';
import { ToastProvider } from './context/ToastContext';
import { useNatureStore } from './store/useNatureStore';
import { supabase } from './lib/supabase';
import { syncAuthUserToProfile } from './services/supabaseService';
import { Profile } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const theme = useNatureStore((s) => s.theme);
  const initSupabaseSync = useNatureStore((s) => s.initSupabaseSync);
  const setCurrentUser = useNatureStore((s) => s.setCurrentUser);
  const setActivePhotographers = useNatureStore((s) => s.setActivePhotographers);
  const pushNotification = useNatureStore((s) => s.pushNotification);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    void initSupabaseSync();

    const client = supabase;
    if (!client) return;

    // Sync active auth session & listen for Google OAuth / Email sign-in changes
    void client.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const profile = await syncAuthUserToProfile(data.session.user);
        setCurrentUser(profile, data.session.user.email ?? null);
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await syncAuthUserToProfile(session.user);
        setCurrentUser(profile, session.user.email ?? null);
      } else {
        setCurrentUser(null, null);
      }
    });

    let syncTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleSync = () => {
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        void initSupabaseSync();
      }, 400);
    };

    // Real-time Database Changes + Presence
    const presenceKey = `nl-${Math.random().toString(36).slice(2, 10)}`;
    const realtimeChannel = client
      .channel('naturelens-db-realtime', {
        config: { presence: { key: presenceKey } },
      })
      .on('presence', { event: 'sync' }, () => {
        const state = realtimeChannel.presenceState();
        const onlineCount = Object.keys(state).length;
        setActivePhotographers(onlineCount || 1);
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photos' },
        (payload) => {
          scheduleSync();
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as Record<string, unknown>;
            const current = useNatureStore.getState().currentUser;
            if (newRow.user_id !== current?.id) {
              const actor =
                useNatureStore.getState().profiles.find((p) => p.id === newRow.user_id) ||
                useNatureStore.getState().profiles[0];
              if (actor) {
                pushNotification({
                  id: `notif-${Date.now()}`,
                  recipient_id: current?.id || 'all',
                  actor: actor as Profile,
                  type: 'photo_featured',
                  entity_id: String(newRow.id || ''),
                  entity_type: 'photo',
                  is_read: false,
                  created_at: new Date().toISOString(),
                });
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        (payload) => {
          scheduleSync();
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as Record<string, unknown>;
            const current = useNatureStore.getState().currentUser;
            if (newRow.user_id !== current?.id && newRow.author_snapshot) {
              pushNotification({
                id: `notif-${Date.now()}`,
                recipient_id: current?.id || 'all',
                actor: newRow.author_snapshot as Profile,
                type: 'comment',
                entity_id: String(newRow.photo_id || ''),
                entity_type: 'photo',
                is_read: false,
                created_at: new Date().toISOString(),
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'challenges' },
        () => {
          scheduleSync();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          scheduleSync();
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await realtimeChannel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      if (syncTimer) clearTimeout(syncTimer);
      authListener.subscription.unsubscribe();
      void client.removeChannel(realtimeChannel);
    };
  }, [initSupabaseSync, setCurrentUser, setActivePhotographers, pushNotification]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
