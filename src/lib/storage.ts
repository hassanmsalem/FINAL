import { User, Screen, ContentItem, Playlist } from '@/types';

const STORAGE_KEYS = {
  USERS: 'websign_users',
  CURRENT_USER: 'websign_current_user',
  SCREENS: 'websign_screens',
  CONTENT: 'websign_content',
  PLAYLISTS: 'websign_playlists',
} as const;

// User management
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Screen management
export const getScreens = (userId: string): Screen[] => {
  const screens = localStorage.getItem(STORAGE_KEYS.SCREENS);
  const allScreens: Screen[] = screens ? JSON.parse(screens) : [];
  return allScreens.filter(screen => screen.userId === userId);
};

export const saveScreen = (screen: Screen): void => {
  const screens = localStorage.getItem(STORAGE_KEYS.SCREENS);
  const allScreens: Screen[] = screens ? JSON.parse(screens) : [];
  const existingIndex = allScreens.findIndex(s => s.id === screen.id);
  
  if (existingIndex >= 0) {
    allScreens[existingIndex] = screen;
  } else {
    allScreens.push(screen);
  }
  
  localStorage.setItem(STORAGE_KEYS.SCREENS, JSON.stringify(allScreens));
};

export const deleteScreen = (screenId: string): void => {
  const screens = localStorage.getItem(STORAGE_KEYS.SCREENS);
  const allScreens: Screen[] = screens ? JSON.parse(screens) : [];
  const filteredScreens = allScreens.filter(s => s.id !== screenId);
  localStorage.setItem(STORAGE_KEYS.SCREENS, JSON.stringify(filteredScreens));
};

// Content management
export const getContent = (userId: string): ContentItem[] => {
  const content = localStorage.getItem(STORAGE_KEYS.CONTENT);
  const allContent: ContentItem[] = content ? JSON.parse(content) : [];
  return allContent.filter(item => item.userId === userId);
};

export const saveContent = (content: ContentItem): void => {
  const allContent = localStorage.getItem(STORAGE_KEYS.CONTENT);
  const contentArray: ContentItem[] = allContent ? JSON.parse(allContent) : [];
  const existingIndex = contentArray.findIndex(c => c.id === content.id);
  
  if (existingIndex >= 0) {
    contentArray[existingIndex] = content;
  } else {
    contentArray.push(content);
  }
  
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(contentArray));
};

export const deleteContent = (contentId: string): void => {
  const content = localStorage.getItem(STORAGE_KEYS.CONTENT);
  const allContent: ContentItem[] = content ? JSON.parse(content) : [];
  const filteredContent = allContent.filter(c => c.id !== contentId);
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(filteredContent));
};

// Playlist management
export const getPlaylists = (userId: string): Playlist[] => {
  const playlists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  const allPlaylists: Playlist[] = playlists ? JSON.parse(playlists) : [];
  return allPlaylists.filter(playlist => playlist.userId === userId);
};

export const savePlaylist = (playlist: Playlist): void => {
  const playlists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  const allPlaylists: Playlist[] = playlists ? JSON.parse(playlists) : [];
  const existingIndex = allPlaylists.findIndex(p => p.id === playlist.id);
  
  if (existingIndex >= 0) {
    allPlaylists[existingIndex] = playlist;
  } else {
    allPlaylists.push(playlist);
  }
  
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(allPlaylists));
};

export const deletePlaylist = (playlistId: string): void => {
  const playlists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  const allPlaylists: Playlist[] = playlists ? JSON.parse(playlists) : [];
  const filteredPlaylists = allPlaylists.filter(p => p.id !== playlistId);
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(filteredPlaylists));
};

// Utility functions
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};