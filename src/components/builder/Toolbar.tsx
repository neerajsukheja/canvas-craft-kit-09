import { Download, ArrowLeft, Code, Layers } from 'lucide-react';
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
    <div className="h-13 bg-[hsl(var(--builder-toolbar))] border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm block leading-tight">{pageTitle}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{templateName}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownloadReact}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-border rounded-lg hover:bg-accent transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
          Export React
        </button>
        <button
          onClick={handleDownloadSnapshot}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Export PNG
        </button>
      </div>
    </div>
  );
}
