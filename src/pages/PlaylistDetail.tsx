import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useWebSign } from '@/contexts/WebSignContext';
import { List, ArrowLeft, Plus, GripVertical, Trash2, FileText, Image, Video, Type } from 'lucide-react';
import { toast } from 'sonner';

export const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylistById, content, updatePlaylist, getContentById } = useWebSign();
  const [selectedContent, setSelectedContent] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const playlist = id ? getPlaylistById(id) : null;

  if (!playlist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Playlist not found</h2>
        <p className="text-gray-600 mt-2">The playlist you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/playlists')} className="mt-4">
          Back to Playlists
        </Button>
      </div>
    );
  }

  const playlistContent = playlist.items
    .map(item => ({ ...item, content: getContentById(item.contentId) }))
    .filter(item => item.content)
    .sort((a, b) => a.order - b.order);

  const availableContent = content.filter(
    item => !playlist.items.some(playlistItem => playlistItem.contentId === item.id)
  );

  const handleAddContent = () => {
    if (selectedContent.size === 0) {
      toast.error('Please select content to add');
      return;
    }

    const newItems = Array.from(selectedContent).map((contentId, index) => ({
      contentId,
      order: playlist.items.length + index + 1,
    }));

    updatePlaylist(playlist.id, [...playlist.items, ...newItems]);
    setSelectedContent(new Set());
  };

  const handleRemoveContent = (contentId: string) => {
    const updatedItems = playlist.items
      .filter(item => item.contentId !== contentId)
      .map((item, index) => ({ ...item, order: index + 1 }));
    
    updatePlaylist(playlist.id, updatedItems);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...playlistContent];
    const draggedContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedContent);

    const updatedItems = items.map((item, idx) => ({
      contentId: item.contentId,
      order: idx + 1,
    }));

    updatePlaylist(playlist.id, updatedItems);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <List className="h-8 w-8 mr-3 text-websign-600" />
            {playlist.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage content items and their display order
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Playlist Content */}
        <Card>
          <CardHeader>
            
            <CardTitle>Playlist Content ({playlistContent.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            {playlistContent.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No content in this playlist yet</p>
                <p className="text-sm text-gray-500 mt-1">Add content from the library on the right</p>
              </div>
            ) : (
              <div className="space-y-2">
                {playlistContent.map((item, index) => {
                  if (!item.content) return null;
                  const IconComponent = getContentIcon(item.content.type);
                  
                  return (
                    <div
                      key={item.contentId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-websign-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {item.content.name || `${item.content.type.charAt(0).toUpperCase() + item.content.type.slice(1)} Content`}
                          </p>
                          <p className="text-xs text-gray-600">{item.content.duration}s duration</p>
                        </div>
                        <Badge className={getTypeColor(item.content.type)}>
                          {item.content.type}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveContent(item.contentId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Content Library ({availableContent.length} available)</CardTitle>
              <Button
                onClick={handleAddContent}
                disabled={selectedContent.size === 0}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Selected ({selectedContent.size})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableContent.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">All content is already in this playlist</p>
                <p className="text-sm text-gray-500 mt-1">Create more content to add to this playlist</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableContent.map((item) => {
                  const IconComponent = getContentIcon(item.type);
                  const isSelected = selectedContent.has(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        isSelected ? 'bg-websign-50 border-websign-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const newSelected = new Set(selectedContent);
                        if (isSelected) {
                          newSelected.delete(item.id);
                        } else {
                          newSelected.add(item.id);
                        }
                        setSelectedContent(newSelected);
                      }}
                    >
                      <Checkbox checked={isSelected} />
                      <IconComponent className="h-4 w-4 text-websign-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.name || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Content`}
                        </p>
                        <p className="text-xs text-gray-600">{item.duration}s duration</p>
                      </div>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How to use this playlist</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Drag and drop items in the left panel to reorder them</li>
              <li>• Select content from the library and click "Add Selected" to add to playlist</li>
              <li>• Content will display in the order shown, with each item's duration setting</li>
              <li>• Assign this playlist to screens from the Screens page</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};