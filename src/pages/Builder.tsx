import { useRef, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { templates } from '@/data/templates';
import { useBuilder } from '@/hooks/useBuilder';
import { ComponentLibrary } from '@/components/builder/ComponentLibrary';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { Toolbar } from '@/components/builder/Toolbar';

const BuilderPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const template = templates.find(t => t.id === templateId);

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
      <div className="flex flex-1 overflow-hidden">
        <ComponentLibrary onDragStart={() => {}} />
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
        <PropertiesPanel
          component={builder.selectedComponent}
          section={builder.selectedSection}
          onUpdateProps={builder.updateComponentProps}
          onUpdateLayout={builder.updateComponentLayout}
          onUpdateSectionLayout={builder.updateSectionLayout}
          onUpdateSectionName={builder.updateSectionName}
        />
      </div>
    </div>
  );
};

export default BuilderPage;
