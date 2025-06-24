import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebSignData, Screen, ContentItem, Playlist } from '@/types';
import { useAuth } from './AuthContext';
import {
  getScreens,
  saveScreen,
  deleteScreen as deleteScreenStorage,
  getContent,
  saveContent,
  deleteContent as deleteContentStorage,
  getPlaylists,
  savePlaylist,
  deletePlaylist as deletePlaylistStorage,
  generateId,
} from '@/lib/storage';
import { toast } from 'sonner';

const WebSignContext = createContext<WebSignData | undefined>(undefined);

export const useWebSign = () => {
  const context = useContext(WebSignContext);
  if (context === undefined) {
    throw new Error('useWebSign must be used within a WebSignProvider');
  }
  return context;
};

export const WebSignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [screens, setScreens] = useState<Screen[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (user) {
      setScreens(getScreens(user.id));
      setContent(getContent(user.id));
      setPlaylists(getPlaylists(user.id));
    } else {
      setScreens([]);
      setContent([]);
      setPlaylists([]);
    }
  }, [user]);

  const createScreen = (name: string): Screen => {
    if (!user) throw new Error('User not authenticated');
    
    const screen: Screen = {
      id: generateId(),
      name,
      userId: user.id,
      playlistId: null,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    
    saveScreen(screen);
    setScreens(prev => [...prev, screen]);
    toast.success('Screen created successfully');
    return screen;
  };

  const createContent = (data: Omit<ContentItem, 'id' | 'userId' | 'createdAt'>): ContentItem => {
    if (!user) throw new Error('User not authenticated');
    
    const contentItem: ContentItem = {
      ...data,
      id: generateId(),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    saveContent(contentItem);
    setContent(prev => [...prev, contentItem]);
    toast.success('Content created successfully');
    return contentItem;
  };

  const createPlaylist = (name: string): Playlist => {
    if (!user) throw new Error('User not authenticated');
    
    const playlist: Playlist = {
      id: generateId(),
      name,
      userId: user.id,
      items: [],
      createdAt: new Date().toISOString(),
    };
    
    savePlaylist(playlist);
    setPlaylists(prev => [...prev, playlist]);
    toast.success('Playlist created successfully');
    return playlist;
  };

  const updatePlaylist = (id: string, items: { contentId: string; order: number }[]): void => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      const updatedPlaylist = { ...playlist, items };
      savePlaylist(updatedPlaylist);
      setPlaylists(prev => prev.map(p => p.id === id ? updatedPlaylist : p));
      toast.success('Playlist updated successfully');
    }
  };

  const assignPlaylistToScreen = (screenId: string, playlistId: string): void => {
    const screen = screens.find(s => s.id === screenId);
    if (screen) {
      const updatedScreen = { ...screen, playlistId };
      saveScreen(updatedScreen);
      setScreens(prev => prev.map(s => s.id === screenId ? updatedScreen : s));
      toast.success('Playlist assigned to screen');
    }
  };

  const deleteScreen = (id: string): void => {
    deleteScreenStorage(id);
    setScreens(prev => prev.filter(s => s.id !== id));
    toast.success('Screen deleted successfully');
  };

  const deleteContent = (id: string): void => {
    deleteContentStorage(id);
    setContent(prev => prev.filter(c => c.id !== id));
    toast.success('Content deleted successfully');
  };

  const deletePlaylist = (id: string): void => {
    deletePlaylistStorage(id);
    setPlaylists(prev => prev.filter(p => p.id !== id));
    // Remove playlist assignment from screens
    const affectedScreens = screens.filter(s => s.playlistId === id);
    affectedScreens.forEach(screen => {
      const updatedScreen = { ...screen, playlistId: null };
      saveScreen(updatedScreen);
    });
    setScreens(prev => prev.map(s => s.playlistId === id ? { ...s, playlistId: null } : s));
    toast.success('Playlist deleted successfully');
  };

  const getScreenById = (id: string): Screen | undefined => {
    return screens.find(s => s.id === id);
  };

  const getPlaylistById = (id: string): Playlist | undefined => {
    return playlists.find(p => p.id === id);
  };

  const getContentById = (id: string): ContentItem | undefined => {
    return content.find(c => c.id === id);
  };

  const value: WebSignData = {
    screens,
    content,
    playlists,
    createScreen,
    createContent,
    createPlaylist,
    updatePlaylist,
    assignPlaylistToScreen,
    deleteScreen,
    deleteContent,
    deletePlaylist,
    getScreenById,
    getPlaylistById,
    getContentById,
  };

  return <WebSignContext.Provider value={value}>{children}</WebSignContext.Provider>;
};