import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebSign } from '@/contexts/WebSignContext';
import { Monitor, ArrowLeft, Copy, ExternalLink, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export const ScreenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getScreenById, playlists, assignPlaylistToScreen } = useWebSign();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

  const screen = id ? getScreenById(id) : null;

  if (!screen) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Screen not found</h2>
        <p className="text-gray-600 mt-2">The screen you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/screens')} className="mt-4">
          Back to Screens
        </Button>
      </div>
    );
  }

  const assignedPlaylist = screen.playlistId ? playlists.find(p => p.id === screen.playlistId) : null;
  const baseUrl = window.location.origin;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Display URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const handleAssignPlaylist = () => {
    if (selectedPlaylistId && selectedPlaylistId !== 'none') {
      assignPlaylistToScreen(screen.id, selectedPlaylistId);
      setSelectedPlaylistId('');
    } else if (selectedPlaylistId === 'none') {
      assignPlaylistToScreen(screen.id, '');
      setSelectedPlaylistId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/screens')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Monitor className="h-8 w-8 mr-3 text-websign-600" />
            {screen.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage this screen's settings and playlist assignment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Screen Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Screen Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={screen.playlistId ? "default" : "secondary"}>
                  {screen.playlistId ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Screen ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{screen.id}</code>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{formatDistanceToNow(new Date(screen.createdAt), { addSuffix: true })}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Last Active:</span>
                <span>{formatDistanceToNow(new Date(screen.lastActive), { addSuffix: true })}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Display URL</h4>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm bg-gray-100 p-2 rounded truncate">
                  {baseUrl}/display/{screen.id}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`${baseUrl}/display/${screen.id}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`${baseUrl}/display/${screen.id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Open this URL on your display device to start showing content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Playlist Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Playlist Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedPlaylist ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Currently Assigned</h4>
                <p className="text-green-800">{assignedPlaylist.name}</p>
                <p className="text-sm text-green-700 mt-1">
                  {assignedPlaylist.items.length} content items
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900">No Playlist Assigned</h4>
                <p className="text-yellow-800">This screen will not display any content</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium">Assign Playlist</label>
              <div className="flex space-x-2">
                <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a playlist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Playlist</SelectItem>
                    {playlists.map((playlist) => (
                      <SelectItem key={playlist.id} value={playlist.id}>
                        {playlist.name} ({playlist.items.length} items)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignPlaylist}
                  disabled={!selectedPlaylistId}
                >
                  Assign
                </Button>
              </div>
              {playlists.length === 0 && (
                <p className="text-sm text-gray-600">
                  No playlists available. Create a playlist first to assign content to this screen.
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Assign a playlist to control what content appears on this screen</li>
                <li>• Content will rotate automatically based on duration settings</li>
                <li>• Changes take effect immediately on the display</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};