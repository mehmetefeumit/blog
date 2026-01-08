import { useState } from 'react';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { Loader2, Send, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function CreateArticle() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [identifier, setIdentifier] = useState('');
  
  const { mutate: createEvent, isPending: isPublishing } = useNostrPublish();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { toast } = useToast();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const tags = await uploadFile(file);
        const imageUrl = tags[0][1];
        setImage(imageUrl);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully!',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload image.',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide at least a title and content.',
        variant: 'destructive',
      });
      return;
    }

    // Generate identifier from title if not provided
    const d = identifier.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const tags: string[][] = [
      ['d', d],
      ['title', title],
      ['published_at', Math.floor(Date.now() / 1000).toString()],
    ];

    if (summary.trim()) {
      tags.push(['summary', summary]);
    }

    if (image.trim()) {
      tags.push(['image', image]);
    }

    // Publish the article (kind 30023)
    createEvent(
      {
        kind: 30023,
        content: content,
        tags: tags,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Article published successfully!',
          });
          // Reset form
          setTitle('');
          setSummary('');
          setContent('');
          setImage('');
          setImageFile(null);
          setIdentifier('');
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to publish article. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const isPending = isPublishing || isUploading;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Create New Article</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="article-title">Title *</Label>
            <Input
              id="article-title"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-identifier">Identifier (optional)</Label>
            <Input
              id="article-identifier"
              placeholder="custom-url-slug"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isPending}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-summary">Summary (optional)</Label>
          <Textarea
            id="article-summary"
            placeholder="Brief summary of the article"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            disabled={isPending}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-image">Featured Image (optional)</Label>
          <div className="flex gap-2">
            <Input
              id="article-image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={isPending}
            />
          </div>
          {image && (
            <div className="relative rounded-lg overflow-hidden border border-border/40">
              <img src={image} alt="Featured" className="w-full max-h-48 object-cover" />
            </div>
          )}
        </div>

        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">
              <FileText className="h-4 w-4 mr-2" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-2">
            <Label htmlFor="article-content">Content (Markdown) *</Label>
            <Textarea
              id="article-content"
              placeholder="Write your article in markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              disabled={isPending}
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supports markdown formatting: **bold**, *italic*, # headings, [links](url), ![images](url), etc.
            </p>
          </TabsContent>
          
          <TabsContent value="preview" className="min-h-[400px]">
            <Card className="border-border/40">
              <CardContent className="pt-6">
                <article className="prose prose-neutral dark:prose-invert max-w-none">
                  {title && <h1>{title}</h1>}
                  {summary && <p className="lead text-muted-foreground">{summary}</p>}
                  {image && <img src={image} alt={title} className="rounded-lg" />}
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">No content to preview yet...</p>
                  )}
                </article>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            onClick={handlePublish}
            disabled={isPending || !title.trim() || !content.trim()}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publish Article
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
