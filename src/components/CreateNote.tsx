import { useState } from 'react';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { Loader2, Image as ImageIcon, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateNote() {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please write some content before publishing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      let finalContent = content;
      let imetaTags: string[][] = [];

      // Upload image if selected
      if (imageFile) {
        const tags = await uploadFile(imageFile);
        const imageUrl = tags[0][1]; // First tag contains the URL
        
        // Add image URL to content
        finalContent = `${content}\n\n${imageUrl}`;
        
        // Add imeta tags for the image
        imetaTags = tags;
      }

      // Publish the note (kind 1)
      createEvent(
        {
          kind: 1,
          content: finalContent,
          tags: imetaTags,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Success',
              description: 'Note published successfully!',
            });
            // Reset form
            setContent('');
            setImageFile(null);
            setImagePreview(null);
          },
          onError: () => {
            toast({
              title: 'Error',
              description: 'Failed to publish note. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image or publish note.',
        variant: 'destructive',
      });
    }
  };

  const isPending = isPublishing || isUploading;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Create New Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note-content">Content</Label>
          <Textarea
            id="note-content"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note-image">Image (optional)</Label>
          <div className="flex gap-2">
            <Input
              id="note-image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isPending}
              className="flex-1"
            />
          </div>
          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden border border-border/40">
              <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-muted" />
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            onClick={handlePublish}
            disabled={isPending || !content.trim()}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? 'Uploading...' : 'Publishing...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publish Note
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
