import { useSeoMeta } from '@unhead/react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CV = () => {
  useSeoMeta({
    title: 'CV',
    description: 'Curriculum Vitae',
  });

  // Path to CV PDF - you'll upload this to /public/cv.pdf
  const cvPath = '/cv.pdf';

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Curriculum Vitae</h1>
        <p className="text-muted-foreground">
          Professional background and experience
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* CV Viewer */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-6">
            {/* Download Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-mono">CV.pdf</span>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={cvPath} download="CV.pdf">
                  Download PDF
                </a>
              </Button>
            </div>

            {/* PDF Embed */}
            <div className="w-full aspect-[8.5/11] bg-background rounded-lg overflow-hidden border border-border/40">
              <embed
                src={cvPath}
                type="application/pdf"
                className="w-full h-full"
              />
            </div>

            {/* Fallback message */}
            <p className="text-sm text-muted-foreground text-center">
              If the PDF doesn't display, you can{' '}
              <a 
                href={cvPath} 
                download="CV.pdf"
                className="text-primary hover:underline"
              >
                download it here
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CV;
