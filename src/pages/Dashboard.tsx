import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWebSign } from '@/contexts/WebSignContext';
import { Monitor, FileText, List, Plus, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { screens, content, playlists } = useWebSign();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Display URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const baseUrl = window.location.origin;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your WebSign dashboard. Manage your digital signage from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Screens</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-websign-600">{screens.length}</div>
            <p className="text-xs text-muted-foreground">
              {screens.filter(s => s.playlistId).length} with playlists assigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-websign-600">{content.length}</div>
            <p className="text-xs text-muted-foreground">
              {content.filter(c => c.type === 'image').length} images, {content.filter(c => c.type === 'video').length} videos, {content.filter(c => c.type === 'text').length} text
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playlists</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-websign-600">{playlists.length}</div>
            <p className="text-xs text-muted-foreground">
              {playlists.reduce((acc, p) => acc + p.items.length, 0)} total items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-websign-100 text-websign-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Create Content</p>
                  <p className="text-sm text-gray-600">Add text, images, or videos to your library</p>
                  <Link to="/content/new">
                    <Button size="sm" variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-websign-100 text-websign-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Build Playlists</p>
                  <p className="text-sm text-gray-600">Organize content into playlists</p>
                  <Link to="/playlists/new">
                    <Button size="sm" variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Playlist
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-websign-100 text-websign-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Setup Screens</p>
                  <p className="text-sm text-gray-600">Register display screens and assign playlists</p>
                  <Link to="/screens/new">
                    <Button size="sm" variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Screen
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-websign-100 text-websign-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Go Live</p>
                  <p className="text-sm text-gray-600">Open display URLs on your screens</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Display URLs</CardTitle>
          </CardHeader>
          <CardContent>
            {screens.length === 0 ? (
              <div className="text-center py-6">
                <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No screens configured yet</p>
                <Link to="/screens/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Screen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {screens.slice(0, 3).map((screen) => (
                  <div key={screen.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{screen.name}</h4>
                        <p className="text-sm text-gray-600">
                          {screen.playlistId ? 'Playlist assigned' : 'No playlist assigned'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
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
                  </div>
                ))}
                {screens.length > 3 && (
                  <Link to="/screens">
                    <Button variant="outline" className="w-full">
                      View All Screens
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <p>Activity tracking coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};