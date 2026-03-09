import { Download, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

interface Props {
  pageTitle: string;
  templateName: string;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function Toolbar({ pageTitle, templateName, canvasRef }: Props) {
  const navigate = useNavigate();

  const handleDownload = async () => {
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
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Snapshot
      </button>
    </div>
  );
}
