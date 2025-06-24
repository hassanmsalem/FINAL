export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Screen {
  id: string;
  name: string;
  userId: string;
  playlistId: string | null;
  lastActive: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  duration: number;
  userId: string;
  createdAt: string;
  name?: string;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  items: { contentId: string; order: number }[];
  createdAt: string;
}

export interface AuthUser {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface WebSignData {
  screens: Screen[];
  content: ContentItem[];
  playlists: Playlist[];
  createScreen: (name: string) => Screen;
  createContent: (data: Omit<ContentItem, 'id' | 'userId' | 'createdAt'>) => ContentItem;
  createPlaylist: (name: string) => Playlist;
  updatePlaylist: (id: string, items: { contentId: string; order: number }[]) => void;
  assignPlaylistToScreen: (screenId: string, playlistId: string) => void;
  deleteScreen: (id: string) => void;
  deleteContent: (id: string) => void;
  deletePlaylist: (id: string) => void;
  getScreenById: (id: string) => Screen | undefined;
  getPlaylistById: (id: string) => Playlist | undefined;
  getContentById: (id: string) => ContentItem | undefined;
}