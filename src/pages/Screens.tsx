import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWebSign } from '@/contexts/WebSignContext';
import { Monitor, Plus, Copy, ExternalLink, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export const Screens = () => {
  const { screens, deleteScreen, getPlaylistById } = useWebSign();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScreens = screens.filter(screen =>
    screen.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Display URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const baseUrl = window.location.origin;

  const handleDeleteScreen = (screenId: string) => {
    if (window.confirm('Are you sure you want to delete this screen?')) {
      deleteScreen(screenId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Screens</h1>
          <p className="text-gray-600 mt-2">
            Manage your display screens and monitor their status
          </p>
        </div>
        <Link to="/screens/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Screen
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search screens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Screens Grid */}
      {filteredScreens.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No screens found' : 'No screens yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first screen to start displaying content'
              }
            </p>
            {!searchTerm && (
              <Link to="/screens/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Screen
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScreens.map((screen) => {
            const playlist = screen.playlistId ? getPlaylistById(screen.playlistId) : null;
            
            return (
              <Card key={screen.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Monitor className="h-5 w-5 mr-2 text-websign-600" />
                      {screen.name}
                    </CardTitle>
                    <Badge variant={screen.playlistId ? "default" : "secondary"}>
                      {screen.playlistId ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={screen.playlistId ? "text-green-600" : "text-yellow-600"}>
                        {screen.playlistId ? "Has Content" : "No Playlist"}
                      </span>
                    </div>
                    
                    {playlist && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Playlist:</span>
                        <span className="font-medium">{playlist.name}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span>{formatDistanceToNow(new Date(screen.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Display URL:</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs bg-gray-100 p-2 rounded truncate">
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
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Link to={`/screens/${screen.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteScreen(screen.id)}
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