import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWebSign } from '@/contexts/WebSignContext';
import { List, Plus, Search, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Playlists = () => {
  const { playlists, screens, deletePlaylist, getContentById } = useWebSign();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePlaylist = (playlistId: string) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(playlistId);
    }
  };

  const getAssignedScreensCount = (playlistId: string) => {
    return screens.filter(screen => screen.playlistId === playlistId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Playlists</h1>
          <p className="text-gray-600 mt-2">
            Organize your content into playlists for your displays
          </p>
        </div>
        <Link to="/playlists/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Playlist
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Playlists Grid */}
      {filteredPlaylists.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <List className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No playlists found' : 'No playlists yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first playlist to organize your content'
              }
            </p>
            {!searchTerm && (
              <Link to="/playlists/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Playlist
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((playlist) => {
            const assignedScreens = getAssignedScreensCount(playlist.id);
            
            return (
              <Card key={playlist.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <List className="h-5 w-5 mr-2 text-websign-600" />
                      <span className="truncate">{playlist.name}</span>
                    </CardTitle>
                    <Badge variant={assignedScreens > 0 ? "default" : "secondary"}>
                      {assignedScreens > 0 ? "In Use" : "Unused"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Content Items:</span>
                      <span className="font-medium">{playlist.items.length}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assigned Screens:</span>
                      <span className="font-medium">{assignedScreens}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span>{formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {playlist.items.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Content:</p>
                      <div className="space-y-1">
                        {playlist.items.slice(0, 3).map((item, index) => {
                          const content = getContentById(item.contentId);
                          if (!content) return null;
                          
                          return (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <FileText className="h-3 w-3 text-gray-400" />
                              <span className="truncate">
                                {content.name || `${content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content`}
                              </span>
                            </div>
                          );
                        })}
                        {playlist.items.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{playlist.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {playlist.items.length === 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">No content items added yet</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Link to={`/playlists/${playlist.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};