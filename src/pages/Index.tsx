import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '@/data/templates';
import { ChevronDown, Layers } from 'lucide-react';

const Index = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const navigate = useNavigate();

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)!;

  const handleContinue = () => {
    navigate(`/builder/${selectedTemplateId}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-4">
            <Layers className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Templify Builder</h1>
          <p className="text-muted-foreground mt-2 text-sm">Select a template to start building your page</p>
        </div>

        {/* Template selection card */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <label className="block text-sm font-medium mb-2">Choose Template</label>
          <div className="relative">
            <select
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
              className="w-full appearance-none border border-input rounded-md px-3 py-2.5 text-sm bg-background pr-10 focus:ring-2 focus:ring-ring outline-none"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Template description */}
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {selectedTemplate.description}
          </p>

          <button
            onClick={handleContinue}
            className="w-full mt-5 bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Visual page builder for React · Wells Fargo style design
        </p>
      </div>
    </div>
  );
};

export default Index;
