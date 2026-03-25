import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '@/data/templates';
import { Layers, ArrowRight, ExternalLink, X } from 'lucide-react';

const similarPages: Record<string, { label: string; url: string }[]> = {
  home: [
    { label: 'Wells Fargo Home', url: 'https://www.wellsfargo.com' },
    { label: 'Chase Home', url: 'https://www.chase.com' },
    { label: 'Bank of America Home', url: 'https://www.bankofamerica.com' },
  ],
  landing: [
    { label: 'Wells Fargo Checking', url: 'https://www.wellsfargo.com/checking/' },
    { label: 'Chase Sapphire', url: 'https://creditcards.chase.com/sapphire-banking' },
    { label: 'Citi Priority', url: 'https://www.citi.com/banking/citi-priority-account' },
  ],
  marketing: [
    { label: 'Wells Fargo Active Cash', url: 'https://www.wellsfargo.com/credit-cards/active-cash/' },
    { label: 'Chase Freedom', url: 'https://creditcards.chase.com/cash-back-credit-cards/freedom' },
    { label: 'Amex Gold Card', url: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/' },
  ],
  blog: [
    { label: 'Wells Fargo Financial Education', url: 'https://www.wellsfargo.com/financial-education/' },
    { label: 'NerdWallet Blog', url: 'https://www.nerdwallet.com/blog' },
    { label: 'Bankrate Articles', url: 'https://www.bankrate.com/banking/' },
  ],
  dashboard: [
    { label: 'Mint Dashboard', url: 'https://mint.intuit.com' },
    { label: 'Personal Capital', url: 'https://www.personalcapital.com' },
    { label: 'YNAB', url: 'https://www.ynab.com' },
  ],
};

const Index = () => {
  const navigate = useNavigate();
  const [popupTemplateId, setPopupTemplateId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Templify Builder</h1>
            <p className="text-xs text-muted-foreground">Visual Page Builder for React</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose a template to start building your page.</p>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Template</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Similar Pages</th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t, idx) => (
                <tr key={t.id} className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors`}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 max-w-sm">{t.description}</div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setPopupTemplateId(t.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Show Similar Pages
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => navigate(`/builder/${t.id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Create Page
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-muted-foreground mt-6 text-center">
          © 2026 Templify Builder · Visual Page Builder for React
        </p>
      </main>

      {/* Similar Pages Popup */}
      {popupTemplateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setPopupTemplateId(null)}>
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-sm">
                Similar Pages — {templates.find(t => t.id === popupTemplateId)?.name}
              </h3>
              <button onClick={() => setPopupTemplateId(null)} className="p-1 hover:bg-accent rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2">
              {(similarPages[popupTemplateId] || []).map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
