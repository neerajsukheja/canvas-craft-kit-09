import { useState } from 'react';
import { Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import type { BuilderPage, ComponentType } from '@/types/builder';
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

const colSpanClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12',
};

const gridColsClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const gapClasses: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const paddingClasses: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const bgClasses: Record<string, string> = {
  transparent: 'bg-transparent',
  white: 'bg-background',
  light: 'bg-muted',
  dark: 'bg-foreground text-background',
  primary: 'bg-primary text-primary-foreground',
  'primary-light': 'bg-primary/5',
  'gold-light': 'bg-gold/10',
};

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const minHeightClasses: Record<string, string> = {
  auto: '',
  sm: 'min-h-[200px]',
  md: 'min-h-[400px]',
  lg: 'min-h-[600px]',
};

const componentPaddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const componentMarginClasses: Record<string, string> = {
  none: '',
  sm: 'm-1',
  md: 'm-2',
  lg: 'm-4',
};

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
      <div ref={canvasRef} className="max-w-5xl mx-auto bg-background shadow-lg rounded-lg overflow-hidden min-h-[600px]">
        {page.sections.map((section, sIdx) => {
          const sl = section.layout;
          const sectionBg = bgClasses[sl?.background] || 'bg-background';
          const sectionPadding = paddingClasses[sl?.padding] || 'p-6';
          const sectionGap = gapClasses[sl?.gap] || 'gap-4';
          const sectionCols = gridColsClasses[sl?.columns] || 'grid-cols-12';
          const sectionMaxWidth = maxWidthClasses[sl?.maxWidth] || 'max-w-7xl';
          const sectionMinHeight = minHeightClasses[sl?.minHeight || 'auto'] || '';

          return (
            <div key={section.id}>
              {sIdx === 0 && <InsertSectionButton onClick={() => onAddSection(0)} />}

              <div
                className={`relative group transition-all ${sectionBg} ${sectionMinHeight} ${
                  selectedSectionId === section.id ? 'ring-2 ring-primary/30' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSection(section.id);
                  onSelectComponent(null);
                }}
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

                {/* Section content as grid */}
                <div
                  className={`${sectionPadding} mx-auto ${sectionMaxWidth}`}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  {section.components.length === 0 && (
                    <div className={`builder-drop-zone py-8 flex items-center justify-center ${
                      dragOverSection === section.id ? 'bg-primary/5 border-primary' : ''
                    }`}>
                      <span className="text-sm text-muted-foreground">Drop components here</span>
                    </div>
                  )}

                  {section.components.length > 0 && (
                    <div className={`grid ${sectionCols} ${sectionGap}`}>
                      {section.components.map((comp, cIdx) => {
                        const cl = comp.layout;
                        const span = colSpanClasses[cl?.colSpan || 12] || 'col-span-12';
                        const cPadding = componentPaddingClasses[cl?.padding || 'none'] || '';
                        const cMargin = componentMarginClasses[cl?.margin || 'none'] || '';

                        return (
                          <div
                            key={comp.id}
                            className={`${span} ${cPadding} ${cMargin} relative group/comp cursor-pointer transition-all rounded ${
                              selectedComponentId === comp.id
                                ? 'builder-component-selected'
                                : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/30'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectComponent(comp.id);
                              onSelectSection(section.id);
                            }}
                            onDragOver={(e) => handleDragOver(e, section.id, cIdx)}
                            onDrop={(e) => handleDrop(e, section.id, cIdx)}
                          >
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
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <InsertSectionButton onClick={() => onAddSection(sIdx + 1)} />
            </div>
          );
        })}

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
