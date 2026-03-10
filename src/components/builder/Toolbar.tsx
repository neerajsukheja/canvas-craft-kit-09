import { Download, ArrowLeft, Code } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import type { BuilderPage } from '@/types/builder';
import { exportAsReactComponent } from '@/utils/exportReactComponent';

interface Props {
  pageTitle: string;
  templateName: string;
  canvasRef: React.RefObject<HTMLDivElement>;
  page: BuilderPage;
}

export function Toolbar({ pageTitle, templateName, canvasRef, page }: Props) {
  const navigate = useNavigate();

  const handleDownloadSnapshot = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `${pageTitle.replace(/\s+/g, '-').toLowerCase()}-snapshot.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  };

  const handleDownloadReact = () => {
    const code = exportAsReactComponent(page);
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${pageTitle.replace(/\s+/g, '-').toLowerCase()}.tsx`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="h-12 bg-[hsl(var(--builder-toolbar))] border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 hover:bg-accent rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{pageTitle}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{templateName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownloadReact}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-accent transition-colors"
        >
          <Code className="w-4 h-4" />
          Download React
        </button>
        <button
          onClick={handleDownloadSnapshot}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Snapshot
        </button>
      </div>
    </div>
  );
}
