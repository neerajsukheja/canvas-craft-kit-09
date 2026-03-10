import { useState, useCallback, useRef } from 'react';
import { Trash2, Plus, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import type { BuilderPage, BuilderComponent, BuilderSection, ComponentType, LayoutProps } from '@/types/builder';
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
  onMoveComponent: (fromSectionId: string, toSectionId: string, componentId: string, toIndex: number) => void;
  onUpdateComponentLayout: (id: string, layout: Partial<LayoutProps>) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const bgClasses: Record<string, string> = {
  transparent: 'bg-transparent',
  white: 'bg-background',
  light: 'bg-muted',
  dark: 'bg-foreground text-background',
  primary: 'bg-primary text-primary-foreground',
  'primary-light': 'bg-primary/5',
  'gold-light': 'bg-gold/10',
};

const paddingClasses: Record<string, string> = {
  none: 'p-0', sm: 'p-3', md: 'p-6', lg: 'p-8', xl: 'p-12',
};

const gapClasses: Record<string, string> = {
  none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6',
};

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-2xl', md: 'max-w-4xl', lg: 'max-w-6xl', xl: 'max-w-7xl', full: 'max-w-full',
};

const minHeightClasses: Record<string, string> = {
  auto: '', sm: 'min-h-[200px]', md: 'min-h-[400px]', lg: 'min-h-[600px]',
};

const componentPaddingClasses: Record<string, string> = {
  none: '', sm: 'p-2', md: 'p-4', lg: 'p-6', xl: 'p-8',
};

const componentMarginClasses: Record<string, string> = {
  none: '', sm: 'm-1', md: 'm-2', lg: 'm-4',
};

export function Canvas({
  page, selectedComponentId, selectedSectionId,
  onSelectComponent, onSelectSection, onAddComponent,
  onDeleteComponent, onDeleteSection, onAddSection,
  onReorderSections, onMoveComponent, onUpdateComponentLayout,
  canvasRef,
}: Props) {
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedComp, setDraggedComp] = useState<{ compId: string; sectionId: string } | null>(null);

  // Handle drop from library OR reorder
  const handleDrop = (e: React.DragEvent, sectionId: string, index?: number) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData('componentType') as ComponentType;
    if (componentType) {
      onAddComponent(sectionId, componentType, index);
    } else if (draggedComp) {
      const toIndex = index ?? page.sections.find(s => s.id === sectionId)?.components.length ?? 0;
      onMoveComponent(draggedComp.sectionId, sectionId, draggedComp.compId, toIndex);
    }
    setDragOverSection(null);
    setDragOverIndex(null);
    setDraggedComp(null);
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
                    <button onClick={(e) => { e.stopPropagation(); onReorderSections(sIdx, sIdx - 1); }} className="p-1 hover:bg-accent rounded">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  )}
                  {sIdx < page.sections.length - 1 && (
                    <button onClick={(e) => { e.stopPropagation(); onReorderSections(sIdx, sIdx + 1); }} className="p-1 hover:bg-accent rounded">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }} className="p-1 hover:bg-destructive/10 text-destructive rounded">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Section content - Bootstrap-style 12-col grid */}
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
                    <div className={`grid grid-cols-12 ${sectionGap}`}>
                      {section.components.map((comp, cIdx) => (
                        <DraggableComponent
                          key={comp.id}
                          comp={comp}
                          cIdx={cIdx}
                          sectionId={section.id}
                          selectedComponentId={selectedComponentId}
                          dragOverSection={dragOverSection}
                          dragOverIndex={dragOverIndex}
                          onSelectComponent={onSelectComponent}
                          onSelectSection={onSelectSection}
                          onDeleteComponent={onDeleteComponent}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onDragStart={() => setDraggedComp({ compId: comp.id, sectionId: section.id })}
                          onDragEnd={() => setDraggedComp(null)}
                          onUpdateComponentLayout={onUpdateComponentLayout}
                        />
                      ))}
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

/** Draggable + resizable component wrapper */
function DraggableComponent({
  comp, cIdx, sectionId, selectedComponentId,
  dragOverSection, dragOverIndex,
  onSelectComponent, onSelectSection, onDeleteComponent,
  onDragOver, onDrop, onDragStart, onDragEnd,
  onUpdateComponentLayout,
}: {
  comp: BuilderComponent;
  cIdx: number;
  sectionId: string;
  selectedComponentId: string | null;
  dragOverSection: string | null;
  dragOverIndex: number | null;
  onSelectComponent: (id: string | null) => void;
  onSelectSection: (id: string | null) => void;
  onDeleteComponent: (id: string) => void;
  onDragOver: (e: React.DragEvent, sectionId: string, index?: number) => void;
  onDrop: (e: React.DragEvent, sectionId: string, index?: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onUpdateComponentLayout: (id: string, layout: Partial<LayoutProps>) => void;
}) {
  const cl = comp.layout;
  const span = cl?.colSpan || 12;
  const isSelected = selectedComponentId === comp.id;
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Mouse resize handler - adjusts colSpan based on drag distance
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const parentGrid = resizeRef.current?.parentElement;
    if (!parentGrid) return;

    const gridWidth = parentGrid.getBoundingClientRect().width;
    const colWidth = gridWidth / 12;
    const startSpan = span;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaCols = Math.round(deltaX / colWidth);
      const newSpan = Math.max(1, Math.min(12, startSpan + deltaCols));
      if (newSpan !== span) {
        onUpdateComponentLayout(comp.id, { colSpan: newSpan });
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [span, comp.id, onUpdateComponentLayout]);

  // Left resize handler
  const handleResizeLeftStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const parentGrid = resizeRef.current?.parentElement;
    if (!parentGrid) return;

    const gridWidth = parentGrid.getBoundingClientRect().width;
    const colWidth = gridWidth / 12;
    const startSpan = span;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const deltaCols = Math.round(deltaX / colWidth);
      const newSpan = Math.max(1, Math.min(12, startSpan + deltaCols));
      if (newSpan !== span) {
        onUpdateComponentLayout(comp.id, { colSpan: newSpan });
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [span, comp.id, onUpdateComponentLayout]);

  const cPadding = componentPaddingClasses[cl?.padding || 'none'] || '';
  const cMargin = componentMarginClasses[cl?.margin || 'none'] || '';

  // Build responsive col-span style using inline grid-column for Bootstrap logic
  const colStyle: React.CSSProperties = {
    gridColumn: `span ${span} / span ${span}`,
  };

  return (
    <div
      ref={resizeRef}
      draggable={!isResizing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      style={colStyle}
      className={`${cPadding} ${cMargin} relative group/comp cursor-pointer transition-all rounded ${
        isSelected
          ? 'builder-component-selected'
          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/30'
      } ${dragOverSection && dragOverIndex === cIdx ? 'ring-2 ring-primary/40' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent(comp.id);
        onSelectSection(sectionId);
      }}
      onDragOver={(e) => onDragOver(e, sectionId, cIdx)}
      onDrop={(e) => onDrop(e, sectionId, cIdx)}
    >
      {/* Drag handle + toolbar */}
      {isSelected && (
        <div className="absolute -top-7 left-0 right-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-primary text-primary-foreground shadow-sm rounded-t px-2 py-0.5">
            <GripVertical className="w-3 h-3 cursor-grab opacity-70" />
            <span className="text-[10px] font-medium">{comp.type}</span>
            <span className="text-[9px] opacity-70 ml-1">col-{span}</span>
          </div>
          <div className="flex gap-1 bg-background shadow-sm rounded border border-border px-1 py-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteComponent(comp.id); }}
              className="p-0.5 hover:bg-destructive/10 text-destructive rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Left resize handle */}
      {isSelected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-30 group/resize-left"
          onMouseDown={handleResizeLeftStart}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full opacity-0 group-hover/resize-left:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Right resize handle */}
      {isSelected && (
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-30 group/resize-right"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full opacity-0 group-hover/resize-right:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Column span indicator on resize */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-primary/50 bg-primary/5 rounded flex items-center justify-center z-20 pointer-events-none">
          <span className="text-xs font-bold text-primary bg-background/90 px-2 py-0.5 rounded">
            {span}/12 cols
          </span>
        </div>
      )}

      <ComponentRenderer component={comp} />
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
