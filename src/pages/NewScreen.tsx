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
import { Monitor, ArrowLeft } from 'lucide-react';

const screenSchema = z.object({
  name: z.string().min(1, 'Screen name is required').min(3, 'Screen name must be at least 3 characters'),
});

type ScreenForm = z.infer<typeof screenSchema>;

export const NewScreen = () => {
  const navigate = useNavigate();
  const { createScreen } = useWebSign();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScreenForm>({
    resolver: zodResolver(screenSchema),
  });

  const onSubmit = async (data: ScreenForm) => {
    setIsLoading(true);
    try {
      const screen = createScreen(data.name);
      navigate(`/screens/${screen.id}`);
    } catch (error) {
      console.error('Error creating screen:', error);
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
          onClick={() => navigate('/screens')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Screen</h1>
          <p className="text-gray-600 mt-2">
            Set up a new display screen for your digital signage
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-websign-600" />
              Screen Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Screen Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Lobby Display, Conference Room TV"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                <p className="text-sm text-gray-600">
                  Give your screen a descriptive name to identify it easily
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• A unique display URL will be generated for this screen</li>
                  <li>• You can assign playlists to control what content is displayed</li>
                  <li>• Open the display URL on your screen device to start showing content</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/screens')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Screen'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};