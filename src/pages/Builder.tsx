import { useRef, useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { templates } from '@/data/templates';
import { useBuilder } from '@/hooks/useBuilder';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { Toolbar } from '@/components/builder/Toolbar';
import { AIDesignChat } from '@/components/builder/AIDesignChat';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

const BuilderPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const template = templates.find(t => t.id === templateId);
  const [showComponents, setShowComponents] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  const initialPage = useMemo(() => {
    if (!template) return null;
    return template.buildPage();
  }, [template]);

  const builder = useBuilder(initialPage || {
    id: 'empty',
    title: 'Empty',
    templateName: 'None',
    sections: [],
  });

  const canvasRef = useRef<HTMLDivElement>(null!);

  if (!template || !initialPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar
        pageTitle={builder.page.title}
        templateName={builder.page.templateName}
        canvasRef={canvasRef}
        page={builder.page}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Toggle buttons */}
        <button
          onClick={() => setShowComponents(prev => !prev)}
          className="absolute top-2 left-2 z-20 p-1.5 bg-background border border-border rounded-lg hover:bg-accent transition-colors shadow-sm"
          title={showComponents ? 'Hide Components' : 'Show Components'}
        >
          {showComponents ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setShowProperties(prev => !prev)}
          className="absolute top-2 right-2 z-20 p-1.5 bg-background border border-border rounded-lg hover:bg-accent transition-colors shadow-sm"
          title={showProperties ? 'Hide Properties' : 'Show Properties'}
        >
          {showProperties ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
        </button>

        {showComponents && <ComponentLibrary onDragStart={() => {}} />}
        <Canvas
          page={builder.page}
          selectedComponentId={builder.selectedComponentId}
          selectedSectionId={builder.selectedSectionId}
          onSelectComponent={builder.setSelectedComponentId}
          onSelectSection={builder.setSelectedSectionId}
          onAddComponent={builder.addComponentToSection}
          onDeleteComponent={builder.deleteComponent}
          onDeleteSection={builder.deleteSection}
          onAddSection={builder.addSection}
          onReorderSections={builder.reorderSections}
          onMoveComponent={builder.moveComponent}
          onUpdateComponentLayout={builder.updateComponentLayout}
          canvasRef={canvasRef}
        />
        {showProperties && (
          <PropertiesPanel
            component={builder.selectedComponent}
            section={builder.selectedSection}
            onUpdateProps={builder.updateComponentProps}
            onUpdateLayout={builder.updateComponentLayout}
            onUpdateSectionLayout={builder.updateSectionLayout}
            onUpdateSectionName={builder.updateSectionName}
          />
        )}
      </div>
      <AIDesignChat page={builder.page} onApplyPageUpdate={builder.setPageDirect} />
    </div>
  );
};

export default BuilderPage;
