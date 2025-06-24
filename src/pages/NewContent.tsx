import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useWebSign } from '@/contexts/WebSignContext';
import { FileText, ArrowLeft, Upload, Image, Video, Type } from 'lucide-react';
import { toast } from 'sonner';

const contentSchema = z.object({
  name: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  duration: z.number().min(1, 'Duration must be at least 1 second').max(300, 'Duration cannot exceed 300 seconds'),
});

type ContentForm = z.infer<typeof contentSchema>;

export const NewContent = () => {
  const navigate = useNavigate();
  const { createContent } = useWebSign();
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text');
  const [duration, setDuration] = useState([10]);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      duration: 10,
    },
  });

  const watchedContent = watch('content');

  const sampleImages = [
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1367269/pexels-photo-1367269.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const onSubmit = async (data: ContentForm) => {
    setIsLoading(true);
    try {
      createContent({
        type: contentType,
        content: data.content,
        duration: data.duration,
        name: data.name,
      });
      navigate('/content');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (contentType === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue('content', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else if (contentType === 'video' && file.type.startsWith('video/')) {
      if (file.size > 100 * 1024 * 1024) { // 100MB
        toast.error('Video file size must be less than 100MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setValue('content', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(`Please select a valid ${contentType} file`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/content')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="text-gray-600 mt-2">
            Add text, images, or videos to your content library
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Content Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={contentType} onValueChange={(value) => {
                setContentType(value as 'text' | 'image' | 'video');
                setValue('content', '');
              }}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text" className="flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center">
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-content">Text Content</Label>
                      <Textarea
                        id="text-content"
                        placeholder="Enter your text content here..."
                        rows={6}
                        {...register('content')}
                        className={errors.content ? 'border-red-500' : ''}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-500">{errors.content.message}</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...register('content')}
                          className={errors.content ? 'border-red-500' : ''}
                        />
                        {errors.content && (
                          <p className="text-sm text-red-500">{errors.content.message}</p>
                        )}
                      </div>

                      <div className="text-center text-gray-500">or</div>

                      {/* File Upload */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive ? 'border-websign-500 bg-websign-50' : 'border-gray-300'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Drag and drop an image file, or{' '}
                          <label className="text-websign-600 cursor-pointer hover:text-websign-500">
                            browse
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileInput}
                            />
                          </label>
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>

                      <div className="text-center text-gray-500">or choose a sample</div>

                      {/* Sample Images */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sampleImages.map((url, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setValue('content', url)}
                            className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-websign-500 transition-colors"
                          >
                            <img src={url} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive ? 'border-websign-500 bg-websign-50' : 'border-gray-300'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag and drop a video file, or{' '}
                        <label className="text-websign-600 cursor-pointer hover:text-websign-500">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={handleFileInput}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500">MP4, WebM, OGG up to 100MB</p>
                    </div>
                    {errors.content && (
                      <p className="text-sm text-red-500">{errors.content.message}</p>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Content Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Content Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="Give your content a descriptive name"
                    {...register('name')}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Display Duration: {duration[0]} seconds</Label>
                  <Slider
                    value={duration}
                    onValueChange={(value) => {
                      setDuration(value);
                      setValue('duration', value[0]);
                    }}
                    max={300}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1s</span>
                    <span>300s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {watchedContent ? (
                  <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                    {contentType === 'text' && (
                      <div className="text-center">
                        <p className="text-lg">{watchedContent}</p>
                      </div>
                    )}
                    {contentType === 'image' && (
                      <img
                        src={watchedContent}
                        alt="Content preview"
                        className="max-w-full max-h-48 object-contain rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                    )}
                    {contentType === 'image' && (
                      <div className="hidden text-gray-500">
                        <Image className="h-12 w-12 mx-auto mb-2" />
                        <p>Image preview unavailable</p>
                      </div>
                    )}
                    {contentType === 'video' && (
                      <video
                        src={watchedContent}
                        className="max-w-full max-h-48 rounded"
                        controls
                        onError={(e) => {
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                    )}
                    {contentType === 'video' && (
                      <div className="hidden text-gray-500">
                        <Video className="h-12 w-12 mx-auto mb-2" />
                        <p>Video preview unavailable</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2" />
                      <p>Content preview will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/content')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Content'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};