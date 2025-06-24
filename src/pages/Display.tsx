import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSign } from '@/contexts/WebSignContext';
import { Monitor, WifiOff, AlertCircle } from 'lucide-react';

interface DisplayState {
  currentIndex: number;
  isPlaying: boolean;
  error: string | null;
}

export const Display = () => {
  const { id } = useParams<{ id: string }>();
  const { getScreenById, getPlaylistById, getContentById } = useWebSign();
  const [displayState, setDisplayState] = useState<DisplayState>({
    currentIndex: 0,
    isPlaying: false,
    error: null,
  });
  const [isConnected, setIsConnected] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const screen = id ? getScreenById(id) : null;
  const playlist = screen?.playlistId ? getPlaylistById(screen.playlistId) : null;
  const playlistContent = playlist?.items
    .map(item => getContentById(item.contentId))
    .filter(Boolean)
    .sort((a, b) => {
      const aOrder = playlist.items.find(item => item.contentId === a!.id)?.order || 0;
      const bOrder = playlist.items.find(item => item.contentId === b!.id)?.order || 0;
      return aOrder - bOrder;
    }) || [];

  const currentContent = playlistContent[displayState.currentIndex];

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Content rotation logic
  useEffect(() => {
    if (!currentContent || !isConnected) return;

    const startTimer = (duration: number) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setDisplayState(prev => ({
          ...prev,
          currentIndex: (prev.currentIndex + 1) % playlistContent.length,
          error: null,
        }));
      }, duration * 1000);
    };

    if (currentContent.type === 'video') {
      // For videos, wait for the video to end or use duration as fallback
      const video = videoRef.current;
      if (video) {
        const handleVideoEnd = () => {
          setDisplayState(prev => ({
            ...prev,
            currentIndex: (prev.currentIndex + 1) % playlistContent.length,
            error: null,
          }));
        };

        const handleVideoError = () => {
          setDisplayState(prev => ({
            ...prev,
            error: 'Video playback failed',
          }));
          startTimer(5); // Show error for 5 seconds
        };

        video.addEventListener('ended', handleVideoEnd);
        video.addEventListener('error', handleVideoError);

        // Fallback timer in case video events don't fire
        startTimer(currentContent.duration + 2);

        return () => {
          video.removeEventListener('ended', handleVideoEnd);
          video.removeEventListener('error', handleVideoError);
        };
      }
    } else {
      startTimer(currentContent.duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentContent, playlistContent.length, isConnected]);

  // Auto-start playback
  useEffect(() => {
    if (playlistContent.length > 0 && isConnected) {
      setDisplayState(prev => ({ ...prev, isPlaying: true, error: null }));
    }
  }, [playlistContent.length, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Error state
  if (!screen) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Screen Not Found</h1>
          <p className="text-gray-400">The display screen you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // No playlist assigned
  if (!playlist) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{screen.name}</h1>
          <p className="text-gray-400 mb-4">No playlist assigned to this screen</p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            {isConnected ? (
              <span className="text-green-400">Connected</span>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-red-400">Connection Lost</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty playlist
  if (playlistContent.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{screen.name}</h1>
          <p className="text-gray-400 mb-2">Playlist "{playlist.name}" is empty</p>
          <p className="text-sm text-gray-500 mb-4">Add content to the playlist to start displaying</p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            {isConnected ? (
              <span className="text-green-400">Connected</span>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-red-400">Connection Lost</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Connection lost
  if (!isConnected) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <WifiOff className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Connection Lost</h1>
          <p className="text-gray-400">Attempting to reconnect...</p>
        </div>
      </div>
    );
  }

  // Display error
  if (displayState.error) {
    return (
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Playback Error</h1>
          <p className="text-gray-400">{displayState.error}</p>
        </div>
      </div>
    );
  }

  // Main display content
  return (
    <div className="fixed inset-0 bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Content Display */}
      <div className="w-full h-full flex items-center justify-center">
        {currentContent && (
          <div className="w-full h-full flex items-center justify-center animate-fade-in">
            {currentContent.type === 'text' && (
              <div className="w-full h-full flex items-center justify-center px-16">
                <p className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight text-center break-words">
                  {currentContent.content}
                </p>
              </div>
            )}

            {currentContent.type === 'image' && (
              <img
                src={currentContent.content}
                alt="Display content"
                className="w-full h-full object-cover"
                onError={(_e) => {
                  setDisplayState(prev => ({
                    ...prev,
                    error: 'Image failed to load',
                  }));
                }}
              />
            )}

            {currentContent.type === 'video' && (
              <video
                ref={videoRef}
                src={currentContent.content}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onError={() => {
                  setDisplayState(prev => ({
                    ...prev,
                    error: 'Video failed to load',
                  }));
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {playlistContent.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {playlistContent.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === displayState.currentIndex ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};