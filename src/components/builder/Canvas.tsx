import { useState, useCallback, useRef } from 'react';
import { Trash2, Plus, ChevronUp, ChevronDown, GripVertical, Move } from 'lucide-react';
import type { BuilderPage, BuilderComponent, BuilderSection, ComponentType, LayoutProps, ComponentProps } from '@/types/builder';
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
  onUpdateComponentProps: (id: string, props: Partial<ComponentProps>) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const bgClasses: Record<string, string> = {
  transparent: 'bg-transparent',
  white: 'bg-background',
  light: 'bg-muted',
  dark: 'bg-foreground text-background',
  primary: 'bg-primary text-primary-foreground',
  'primary-light': 'bg-primary/5',
  'gold-light': 'bg-[hsl(var(--gold-accent))]/10',
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

const componentMinHeightClasses: Record<string, string> = {
  auto: '', sm: 'min-h-[60px]', md: 'min-h-[120px]', lg: 'min-h-[200px]', xl: 'min-h-[300px]',
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
  onUpdateComponentProps,
  canvasRef,
}: Props) {
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedComp, setDraggedComp] = useState<{ compId: string; sectionId: string } | null>(null);

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
    <div className="flex-1 bg-[hsl(var(--builder-canvas))] overflow-y-auto">
      <div className="p-6">
        <div ref={canvasRef} className="max-w-5xl mx-auto bg-background shadow-xl rounded-xl overflow-hidden min-h-[600px] border border-border/50">
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
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1 p-1.5 bg-background/95 backdrop-blur-sm rounded-bl-lg border-l border-b border-border shadow-sm">
                    <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{section.name}</span>
                    {sIdx > 0 && (
                      <button onClick={(e) => { e.stopPropagation(); onReorderSections(sIdx, sIdx - 1); }} className="p-1 hover:bg-accent rounded transition-colors">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {sIdx < page.sections.length - 1 && (
                      <button onClick={(e) => { e.stopPropagation(); onReorderSections(sIdx, sIdx + 1); }} className="p-1 hover:bg-accent rounded transition-colors">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }} className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    className={`${sectionPadding} mx-auto ${sectionMaxWidth}`}
                    onDragOver={(e) => handleDragOver(e, section.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, section.id)}
                  >
                    {section.components.length === 0 && (
                      <div className={`builder-drop-zone py-10 flex flex-col items-center justify-center gap-2 ${
                        dragOverSection === section.id ? 'bg-primary/5 border-primary' : ''
                      }`}>
                        <Move className="w-5 h-5 text-muted-foreground/50" />
                        <span className="text-sm text-muted-foreground/70">Drag & drop components here</span>
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
                            onUpdateComponentProps={onUpdateComponentProps}
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
            <div className="flex flex-col items-center justify-center h-96 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Plus className="w-7 h-7 text-muted-foreground" />
              </div>
              <button
                onClick={() => onAddSection()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-dashed border-border rounded-lg hover:bg-accent hover:border-primary/30 transition-all"
              >
                Add First Section
              </button>
              <p className="text-xs text-muted-foreground">Start building your page</p>
            </div>
          )}
        </div>
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
  onUpdateComponentLayout, onUpdateComponentProps,
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
  onUpdateComponentProps: (id: string, props: Partial<ComponentProps>) => void;
}) {
  const cl = comp.layout;
  const span = cl?.colSpan || 12;
  const isSelected = selectedComponentId === comp.id;
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<'width' | 'height' | null>(null);

  // Width resize (right handle)
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDir('width');

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
      setResizeDir(null);
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

  // Width resize (left handle)
  const handleResizeLeftStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDir('width');

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
      setResizeDir(null);
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

  // Height resize (bottom handle)
  const handleResizeHeightStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDir('height');

    const startY = e.clientY;
    const el = resizeRef.current;
    if (!el) return;

    const startHeight = el.getBoundingClientRect().height;
    const heightSteps = [
      { label: 'auto', value: 0 },
      { label: 'sm', value: 60 },
      { label: 'md', value: 120 },
      { label: 'lg', value: 200 },
      { label: 'xl', value: 300 },
    ];

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const targetHeight = startHeight + deltaY;

      // Snap to nearest height step
      let closest = heightSteps[0];
      let minDist = Infinity;
      for (const step of heightSteps) {
        const dist = Math.abs(targetHeight - (step.value || startHeight));
        if (dist < minDist) {
          minDist = dist;
          closest = step;
        }
      }
      onUpdateComponentLayout(comp.id, { minHeight: closest.label });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      setResizeDir(null);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [comp.id, onUpdateComponentLayout]);

  const cPadding = componentPaddingClasses[cl?.padding || 'none'] || '';
  const cMargin = componentMarginClasses[cl?.margin || 'none'] || '';
  const cMinHeight = componentMinHeightClasses[cl?.minHeight || 'auto'] || '';

  // Build inline styles from advanced layout props
  const advancedStyle: React.CSSProperties = {};
  
  // Individual spacing overrides
  const spacingMap: Record<string, string> = { none: '0', xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
  if (cl?.paddingTop && cl.paddingTop !== 'none') advancedStyle.paddingTop = spacingMap[cl.paddingTop] || undefined;
  if (cl?.paddingRight && cl.paddingRight !== 'none') advancedStyle.paddingRight = spacingMap[cl.paddingRight] || undefined;
  if (cl?.paddingBottom && cl.paddingBottom !== 'none') advancedStyle.paddingBottom = spacingMap[cl.paddingBottom] || undefined;
  if (cl?.paddingLeft && cl.paddingLeft !== 'none') advancedStyle.paddingLeft = spacingMap[cl.paddingLeft] || undefined;
  if (cl?.marginTop && cl.marginTop !== 'none') advancedStyle.marginTop = spacingMap[cl.marginTop] || undefined;
  if (cl?.marginBottom && cl.marginBottom !== 'none') advancedStyle.marginBottom = spacingMap[cl.marginBottom] || undefined;

  // Typography overrides
  const fontSizeMap: Record<string, string> = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem' };
  if (cl?.fontFamily && cl.fontFamily !== 'inherit') advancedStyle.fontFamily = cl.fontFamily;
  if (cl?.fontSize && cl.fontSize !== 'inherit') advancedStyle.fontSize = fontSizeMap[cl.fontSize] || undefined;
  const fwMap: Record<string, number> = { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 };
  if (cl?.fontWeight && cl.fontWeight !== 'inherit') advancedStyle.fontWeight = fwMap[cl.fontWeight] || undefined;
  const lhMap: Record<string, string> = { tight: '1.25', snug: '1.375', normal: '1.5', relaxed: '1.625', loose: '2' };
  if (cl?.lineHeight && cl.lineHeight !== 'inherit') advancedStyle.lineHeight = lhMap[cl.lineHeight] || undefined;
  const lsMap: Record<string, string> = { tighter: '-0.05em', tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em', widest: '0.1em' };
  if (cl?.letterSpacing && cl.letterSpacing !== 'inherit') advancedStyle.letterSpacing = lsMap[cl.letterSpacing] || undefined;

  // Background & Border
  const bgColorMap: Record<string, string> = { white: 'hsl(0 0% 100%)', light: 'hsl(220 14% 96%)', dark: 'hsl(220 20% 14%)', primary: 'hsl(0 76% 44%)', 'primary-light': 'hsl(0 76% 44% / 0.05)', 'gold-light': 'hsl(43 74% 49% / 0.1)', accent: 'hsl(220 14% 96%)' };
  if (cl?.backgroundColor && cl.backgroundColor !== 'none') advancedStyle.backgroundColor = bgColorMap[cl.backgroundColor] || undefined;
  const gradientMap: Record<string, string> = { 'primary-to-dark': 'linear-gradient(135deg, hsl(0 76% 44%), hsl(0 60% 30%))', 'dark-to-light': 'linear-gradient(135deg, hsl(220 20% 14%), hsl(220 14% 96%))', 'gold-shimmer': 'linear-gradient(135deg, hsl(43 74% 49%), hsl(43 74% 65%))', 'blue-purple': 'linear-gradient(135deg, hsl(220 90% 56%), hsl(270 76% 55%))', sunset: 'linear-gradient(135deg, hsl(20 90% 56%), hsl(340 76% 55%))' };
  if (cl?.backgroundGradient && cl.backgroundGradient !== 'none') advancedStyle.background = gradientMap[cl.backgroundGradient] || undefined;
  const bwMap: Record<string, string> = { '1': '1px', '2': '2px', '4': '4px' };
  if (cl?.borderWidth && cl.borderWidth !== 'none') advancedStyle.borderWidth = bwMap[cl.borderWidth] || undefined;
  const bcMap: Record<string, string> = { default: 'hsl(220 13% 91%)', primary: 'hsl(0 76% 44%)', muted: 'hsl(220 9% 46%)', gold: 'hsl(43 74% 49%)', transparent: 'transparent' };
  if (cl?.borderColor) advancedStyle.borderColor = bcMap[cl.borderColor] || undefined;
  const brMap: Record<string, string> = { none: '0', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', full: '9999px' };
  if (cl?.borderRadius && cl.borderRadius !== 'none') advancedStyle.borderRadius = brMap[cl.borderRadius] || undefined;
  if (cl?.borderStyle && cl.borderStyle !== 'solid') advancedStyle.borderStyle = cl.borderStyle;
  const shadowMap: Record<string, string> = { sm: '0 1px 2px rgba(0,0,0,.05)', md: '0 4px 6px rgba(0,0,0,.1)', lg: '0 10px 15px rgba(0,0,0,.1)', xl: '0 20px 25px rgba(0,0,0,.1)', '2xl': '0 25px 50px rgba(0,0,0,.25)', inner: 'inset 0 2px 4px rgba(0,0,0,.06)' };
  if (cl?.boxShadow && cl.boxShadow !== 'none') advancedStyle.boxShadow = shadowMap[cl.boxShadow] || undefined;
  if (cl?.opacity && cl.opacity !== '100') advancedStyle.opacity = Number(cl.opacity) / 100;
  if (cl?.overflow && cl.overflow !== 'visible') advancedStyle.overflow = cl.overflow as any;

  const colStyle: React.CSSProperties = {
    gridColumn: `span ${span} / span ${span}`,
    ...advancedStyle,
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
      className={`${cPadding} ${cMargin} ${cMinHeight} relative group/comp cursor-pointer transition-all rounded-md ${
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
        <div className="absolute -top-8 left-0 right-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-primary text-primary-foreground shadow-md rounded-t-lg px-2.5 py-1">
            <GripVertical className="w-3 h-3 cursor-grab opacity-70" />
            <span className="text-[10px] font-semibold tracking-wide">{comp.type}</span>
            <span className="text-[9px] opacity-60 ml-1 bg-primary-foreground/20 px-1.5 py-0.5 rounded">
              {span}/12{cl?.minHeight && cl.minHeight !== 'auto' ? ` · h:${cl.minHeight}` : ''}
            </span>
          </div>
          <div className="flex gap-0.5 bg-background shadow-md rounded-lg border border-border px-1.5 py-1">
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteComponent(comp.id); }}
              className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Left resize handle */}
      {isSelected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 cursor-col-resize z-30 group/resize-left"
          onMouseDown={handleResizeLeftStart}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full opacity-0 group-hover/resize-left:opacity-100 transition-opacity shadow-sm" />
        </div>
      )}

      {/* Right resize handle */}
      {isSelected && (
        <div
          className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize z-30 group/resize-right"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full opacity-0 group-hover/resize-right:opacity-100 transition-opacity shadow-sm" />
        </div>
      )}

      {/* Bottom resize handle (height) */}
      {isSelected && (
        <div
          className="absolute bottom-0 left-0 right-0 h-2.5 cursor-row-resize z-30 group/resize-bottom"
          onMouseDown={handleResizeHeightStart}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-10 bg-primary rounded-full opacity-0 group-hover/resize-bottom:opacity-100 transition-opacity shadow-sm" />
        </div>
      )}

      {/* Resize indicator overlay */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-primary/50 bg-primary/5 rounded-md flex items-center justify-center z-20 pointer-events-none">
          <span className="text-xs font-bold text-primary bg-background/95 px-3 py-1 rounded-md shadow-sm">
            {resizeDir === 'width' ? `${span}/12 cols` : `height: ${cl?.minHeight || 'auto'}`}
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
        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary rounded-full transition-all hover:bg-primary/5"
      >
        <Plus className="w-3 h-3" />
        Section
      </button>
    </div>
  );
}
