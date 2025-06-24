import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWebSign } from '@/contexts/WebSignContext';
import { List, ArrowLeft } from 'lucide-react';

const playlistSchema = z.object({
  name: z.string().min(1, 'Playlist name is required').min(3, 'Playlist name must be at least 3 characters'),
});

type PlaylistForm = z.infer<typeof playlistSchema>;

export const NewPlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist } = useWebSign();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaylistForm>({
    resolver: zodResolver(playlistSchema),
  });

  const onSubmit = async (data: PlaylistForm) => {
    setIsLoading(true);
    try {
      const playlist = createPlaylist(data.name);
      navigate(`/playlists/${playlist.id}`);
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/playlists')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Playlist</h1>
          <p className="text-gray-600 mt-2">
            Organize your content into playlists for your displays
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="h-5 w-5 mr-2 text-websign-600" />
              Playlist Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Announcements, Lunch Menu"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                <p className="text-sm text-gray-600">
                  Choose a descriptive name for your playlist
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Add content items to your playlist</li>
                  <li>• Arrange them in the order you want them to display</li>
                  <li>• Assign the playlist to one or more screens</li>
                  <li>• Content will rotate automatically based on duration settings</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/playlists')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Playlist'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};