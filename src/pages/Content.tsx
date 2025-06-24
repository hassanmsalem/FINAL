import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebSign } from '@/contexts/WebSignContext';
import { FileText, Plus, Search, Trash2, Image, Video, Type } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Content = () => {
  const { content, deleteContent } = useWebSign();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredContent = content.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && item.type === activeTab;
  });

  const handleDeleteContent = (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      deleteContent(contentId);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const contentCounts = {
    all: content.length,
    text: content.filter(c => c.type === 'text').length,
    image: content.filter(c => c.type === 'image').length,
    video: content.filter(c => c.type === 'video').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600 mt-2">
            Manage your text, images, and videos for digital displays
          </p>
        </div>
        <Link to="/content/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({contentCounts.all})</TabsTrigger>
            <TabsTrigger value="text">Text ({contentCounts.text})</TabsTrigger>
            <TabsTrigger value="image">Images ({contentCounts.image})</TabsTrigger>
            <TabsTrigger value="video">Videos ({contentCounts.video})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No content found' : 'No content yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first content item to get started'
              }
            </p>
            {!searchTerm && (
              <Link to="/content/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const IconComponent = getContentIcon(item.type);
            
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <IconComponent className="h-5 w-5 mr-2 text-websign-600" />
                      <span className="truncate">
                        {item.name || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Content`}
                      </span>
                    </CardTitle>
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Content Preview */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {item.type === 'text' && (
                      <p className="text-sm line-clamp-3">{item.content}</p>
                    )}
                    {item.type === 'image' && (
                      <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                        <img 
                          src={item.content} 
                          alt="Content preview"
                          className="max-w-full max-h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden text-gray-500 text-sm">
                          <Image className="h-8 w-8 mx-auto mb-2" />
                          Image preview unavailable
                        </div>
                      </div>
                    )}
                    {item.type === 'video' && (
                      <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{item.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContent(item.id)}
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