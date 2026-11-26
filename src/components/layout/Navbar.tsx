import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Camera,
  Search,
  Menu,
  X,
  PlusCircle,
  Sun,
  Moon,
  Bell,
  LogOut,
  User as UserIcon,
  Bookmark,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { SearchModal } from '@/components/common/SearchModal';
import { PhotoDownloadModal } from '@/components/gallery/PhotoDownloadModal';
import { Avatar } from '@/components/common/Avatar';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { showToast } = useToast();

  const theme = useNatureStore((s) => s.theme);
  const toggleTheme = useNatureStore((s) => s.toggleTheme);
  const currentUser = useNatureStore((s) => s.currentUser);
  const logout = useNatureStore((s) => s.logout);
  const notifications = useNatureStore((s) => s.notifications);
  const markAllNotificationsRead = useNatureStore((s) => s.markAllNotificationsRead);
  const savedCount = useNatureStore((s) => s.savedPhotoIds.length);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPhotoFromSearch = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsDownloadModalOpen(true);
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Categories', path: '/categories' },
    { name: 'Challenges', path: '/challenges' },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-nature-surface/85 backdrop-blur-xl border-b border-nature-border py-3 shadow-sm'
            : 'bg-nature-dark/70 backdrop-blur-md border-b border-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-nature-elevated border border-nature-border flex items-center justify-center transition-all duration-300 group-hover:border-nature-accent group-hover:shadow-sm">
                <Camera className="w-5 h-5 text-nature-accent transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-tight font-semibold text-nature-parchment group-hover:text-nature-accent transition-colors">
                  Nature<span className="text-nature-accent">Lens</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-nature-textMuted -mt-1 font-sans">
                  Nature Photography
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-nature-elevated/70 p-1 rounded-full border border-nature-border">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all',
                      isActive
                        ? 'bg-nature-surface text-nature-accent shadow-sm font-semibold'
                        : 'text-nature-textMuted hover:text-nature-parchment'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Command Palette Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full text-nature-textMuted hover:text-nature-parchment bg-nature-elevated hover:bg-nature-border/50 border border-nature-border transition-all text-xs"
                title="Search photographs, biomes & photographers (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-nature-accent" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-nature-surface text-nature-accent border border-nature-border">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full bg-nature-elevated hover:bg-nature-border/50 border border-nature-border text-nature-textMuted hover:text-nature-accent transition-colors"
                title={theme === 'light' ? 'Switch to Dark Studio' : 'Switch to Light Gallery'}
                aria-label="Toggle color theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Real-time Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  className="relative p-2 rounded-full bg-nature-elevated hover:bg-nature-border/50 border border-nature-border text-nature-textMuted hover:text-nature-accent transition-colors"
                  title="Real-time notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-nature-accent text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-nature-surface border border-nature-border shadow-xl p-3 z-50 space-y-2">
                    <div className="flex items-center justify-between px-2 py-1 border-b border-nature-border">
                      <span className="text-xs font-semibold text-nature-parchment">
                        Live Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-nature-accent hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-nature-textMuted text-center py-6">
                          No new notifications yet.
                        </p>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                        <Link
                          key={n.id}
                          to={n.entity_id ? `/photo/${n.entity_id}` : '/explore'}
                          onClick={() => setNotifOpen(false)}
                          className={cn(
                            'flex items-start gap-2.5 p-2 rounded-xl transition-colors text-xs',
                            n.is_read
                              ? 'hover:bg-nature-elevated/60 text-nature-textMuted'
                              : 'bg-nature-accentMuted/50 hover:bg-nature-accentMuted text-nature-parchment'
                          )}
                        >
                          <Avatar src={n.actor.avatar_url} alt={n.actor.full_name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="leading-snug">
                              <span className="font-semibold">{n.actor.full_name}</span>{' '}
                              {n.type === 'like' ? 'appreciated your photograph' : 'commented on a photograph'}
                            </p>
                            <span className="text-[10px] text-nature-textSubtle font-mono">
                              {new Date(n.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/upload">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<PlusCircle className="w-4 h-4 text-nature-accent" />}
                >
                  Submit Photo
                </Button>
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-2 pl-1">
                  <Link
                    to={`/@${currentUser.username}`}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-nature-elevated border border-nature-border hover:border-nature-accent transition-colors"
                    title="View your portfolio"
                  >
                    <Avatar src={currentUser.avatar_url} alt={currentUser.full_name} size="sm" />
                    <span className="text-xs font-medium text-nature-parchment max-w-[90px] truncate">
                      {currentUser.full_name.split(' ')[0]}
                    </span>
                    {savedCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-nature-accent">
                        <Bookmark className="w-3 h-3 fill-current" />
                        {savedCount}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      showToast('Signed out of NatureLens', 'info');
                    }}
                    className="p-2 rounded-full bg-nature-elevated border border-nature-border text-nature-textMuted hover:text-red-500 transition-colors"
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-nature-elevated text-nature-textMuted border border-nature-border"
                aria-label="Toggle color theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-xl bg-nature-elevated text-nature-accent border border-nature-border"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-nature-elevated border border-nature-border text-nature-parchment"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-nature-border bg-nature-surface px-4 py-4 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'bg-nature-elevated text-nature-accent font-semibold'
                      : 'text-nature-textMuted hover:text-nature-parchment'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-nature-border flex items-center gap-2">
              <Link to="/upload" className="flex-1">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Submit Photo
                </Button>
              </Link>
              {currentUser ? (
                <Link to={`/@${currentUser.username}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full justify-center" leftIcon={<UserIcon className="w-4 h-4" />}>
                    Profile
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectPhoto={handleSelectPhotoFromSearch}
      />

      <PhotoDownloadModal
        photo={selectedPhoto}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </>
  );
};
