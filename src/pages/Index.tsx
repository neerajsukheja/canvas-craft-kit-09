import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '@/data/templates';
import { Layers, ArrowRight, Check } from 'lucide-react';

const Index = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/builder/${selectedTemplateId}`);
  };

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary text-primary-foreground flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Templify</span>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Build beautiful<br />pages visually.
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
            Drag, drop, and customize. Export as React components or pixel-perfect snapshots.
          </p>
          <div className="mt-8 space-y-3">
            {['12-column Bootstrap grid', 'Drag & drop components', 'Visual resize controls', 'Export as React or PNG'].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                {feat}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © 2026 Templify Builder · Visual Page Builder for React
        </p>
      </div>

      {/* Right selection panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Templify Builder</h1>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Choose a template</h1>
            <p className="text-muted-foreground mt-1.5">Select a starting point for your page design.</p>
          </div>

          {/* Template cards */}
          <div className="space-y-3">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedTemplateId === t.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{t.description}</p>
                  </div>
                  {selectedTemplateId === t.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            className="w-full mt-6 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Continue to Builder
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
