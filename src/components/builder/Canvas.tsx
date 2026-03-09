import { useState, useRef } from 'react';
import { Trash2, GripVertical, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import type { BuilderPage, ComponentType, BuilderSection } from '@/types/builder';
import { ComponentRenderer } from './ComponentRenderer';

interface Props {
  page: BuilderPage;
  selectedComponentId: string | null;
  selectedSectionId: string | null;
  onSelectComponent: (id: string | null) => void;
  onSelectSection: (id: string | null) => void;
  onAddComponent: (sectionId: string, type: ComponentType, index?: number) => void;
  onDeleteComponent: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onAddSection: (index?: number) => void;
  onReorderSections: (from: number, to: number) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function Canvas({
  page,
  selectedComponentId,
  selectedSectionId,
  onSelectComponent,
  onSelectSection,
  onAddComponent,
  onDeleteComponent,
  onDeleteSection,
  onAddSection,
  onReorderSections,
  canvasRef,
}: Props) {
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent, sectionId: string, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const componentType = e.dataTransfer.getData('componentType') as ComponentType;
    if (componentType) {
      onAddComponent(sectionId, componentType, index);
    }
    setDragOverSection(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSection(sectionId);
    setDragOverIndex(index ?? null);
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex-1 bg-[hsl(var(--builder-canvas))] overflow-y-auto p-6">
      <div ref={canvasRef} className="max-w-4xl mx-auto bg-background shadow-lg rounded-lg overflow-hidden min-h-[600px]">
        {page.sections.map((section, sIdx) => (
          <div key={section.id}>
            {/* Insert section button between sections */}
            {sIdx === 0 && (
              <InsertSectionButton onClick={() => onAddSection(0)} />
            )}

            <div
              className={`relative group transition-all ${
                selectedSectionId === section.id ? 'ring-2 ring-primary/30' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSection(section.id);
                onSelectComponent(null);
              }}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, section.id)}
            >
              {/* Section toolbar */}
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1 p-1 bg-background/90 rounded-bl-md border-l border-b border-border">
                <span className="text-[10px] text-muted-foreground px-1 py-0.5">{section.name}</span>
                {sIdx > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onReorderSections(sIdx, sIdx - 1); }}
                    className="p-1 hover:bg-accent rounded"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                )}
                {sIdx < page.sections.length - 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onReorderSections(sIdx, sIdx + 1); }}
                    className="p-1 hover:bg-accent rounded"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }}
                  className="p-1 hover:bg-destructive/10 text-destructive rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Section content */}
              <div className={`${section.style || 'wf-section'} ${
                dragOverSection === section.id ? 'bg-primary/5' : ''
              }`}>
                {section.components.length === 0 && (
                  <div className="builder-drop-zone py-8 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Drop components here</span>
                  </div>
                )}

                {section.components.map((comp, cIdx) => (
                  <div key={comp.id}>
                    {/* Drop indicator between components */}
                    <div
                      className={`transition-all ${
                        dragOverSection === section.id && dragOverIndex === cIdx
                          ? 'h-1 bg-primary/50 rounded my-1'
                          : 'h-0'
                      }`}
                      onDragOver={(e) => handleDragOver(e, section.id, cIdx)}
                      onDrop={(e) => handleDrop(e, section.id, cIdx)}
                    />

                    <div
                      className={`relative group/comp cursor-pointer transition-all rounded px-1 py-0.5 ${
                        selectedComponentId === comp.id
                          ? 'builder-component-selected'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/30'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComponent(comp.id);
                        onSelectSection(section.id);
                      }}
                    >
                      {/* Component actions */}
                      {selectedComponentId === comp.id && (
                        <div className="absolute -top-6 right-0 z-20 flex gap-1 bg-background shadow-sm rounded border border-border px-1 py-0.5">
                          <span className="text-[10px] text-muted-foreground px-1">{comp.type}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteComponent(comp.id); }}
                            className="p-0.5 hover:bg-destructive/10 text-destructive rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <ComponentRenderer component={comp} />
                    </div>
                  </div>
                ))}

                {/* Drop zone at end */}
                {section.components.length > 0 && (
                  <div
                    className={`transition-all mt-2 ${
                      dragOverSection === section.id && (dragOverIndex === null || dragOverIndex >= section.components.length)
                        ? 'h-1 bg-primary/50 rounded'
                        : 'h-0'
                    }`}
                    onDragOver={(e) => handleDragOver(e, section.id, section.components.length)}
                    onDrop={(e) => handleDrop(e, section.id, section.components.length)}
                  />
                )}
              </div>
            </div>

            <InsertSectionButton onClick={() => onAddSection(sIdx + 1)} />
          </div>
        ))}

        {page.sections.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <button
              onClick={() => onAddSection()}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-dashed border-border rounded-md hover:bg-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InsertSectionButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex items-center justify-center py-1 opacity-0 hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary rounded-full transition-colors"
      >
        <Plus className="w-3 h-3" />
        Section
      </button>
    </div>
  );
}
