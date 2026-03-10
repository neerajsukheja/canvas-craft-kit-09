import type { BuilderComponent, BuilderSection, ComponentProps, LayoutProps, SectionLayout } from '@/types/builder';
import { COMPONENT_PROPERTY_DEFS, LAYOUT_PROPERTY_DEFS, SECTION_LAYOUT_DEFS } from '@/types/builder';
import { Settings2, Columns, ArrowUpDown } from 'lucide-react';

interface Props {
  component: BuilderComponent | null;
  section: BuilderSection | null;
  onUpdateProps: (id: string, props: Partial<ComponentProps>) => void;
  onUpdateLayout: (id: string, layout: Partial<LayoutProps>) => void;
  onUpdateSectionLayout: (id: string, layout: Partial<SectionLayout>) => void;
  onUpdateSectionName: (id: string, name: string) => void;
}

function RenderField({
  def,
  value,
  onChange,
}: {
  def: { key: string; label: string; type: string; options?: string[] };
  value: string | number | boolean;
  onChange: (val: string | number | boolean) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">{def.label}</label>
      {def.type === 'text' && (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-input rounded-lg px-2.5 py-1.5 text-xs bg-background focus:ring-1 focus:ring-ring outline-none transition-colors"
        />
      )}
      {def.type === 'select' && (
        <select
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-input rounded-lg px-2.5 py-1.5 text-xs bg-background focus:ring-1 focus:ring-ring outline-none transition-colors"
        >
          {def.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {def.type === 'number' && (
        <input
          type="number"
          value={(value as number) || 0}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full border border-input rounded-lg px-2.5 py-1.5 text-xs bg-background focus:ring-1 focus:ring-ring outline-none transition-colors"
        />
      )}
      {def.type === 'boolean' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
            className="rounded border-input accent-primary"
          />
          <span className="text-xs">Enabled</span>
        </label>
      )}
    </div>
  );
}

export function PropertiesPanel({ component, section, onUpdateProps, onUpdateLayout, onUpdateSectionLayout, onUpdateSectionName }: Props) {
  if (!component && !section) {
    return (
      <div className="w-72 builder-panel border-l border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Settings2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No Selection</p>
            <p className="text-xs mt-1 opacity-70">Click a component or section to edit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 builder-panel border-l border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Properties</h2>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Section properties */}
        {section && !component && (
          <>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Section</span>
              <RenderField
                def={{ key: 'name', label: 'Name', type: 'text' }}
                value={section.name}
                onChange={(val) => onUpdateSectionName(section.id, val as string)}
              />
            </div>
            <div className="border-t border-border pt-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">Layout</span>
              <div className="space-y-2.5">
                {SECTION_LAYOUT_DEFS.map(def => (
                  <RenderField
                    key={def.key}
                    def={def}
                    value={(section.layout as any)?.[def.key] ?? ''}
                    onChange={(val) => onUpdateSectionLayout(section.id, { [def.key]: def.key === 'columns' ? Number(val) : val } as any)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Component properties */}
        {component && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Settings2 className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{component.type}</span>
              </div>
              <div className="space-y-2.5">
                {(COMPONENT_PROPERTY_DEFS[component.type] || []).map(def => (
                  <RenderField
                    key={def.key}
                    def={def}
                    value={component.props[def.key] as string | number | boolean}
                    onChange={(val) => onUpdateProps(component.id, { [def.key]: val })}
                  />
                ))}
              </div>
            </div>

            {/* Grid layout section */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                  <Columns className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grid Layout</span>
              </div>
              <div className="space-y-2.5">
                {LAYOUT_PROPERTY_DEFS.map(def => {
                  const val = def.key === 'colSpan'
                    ? String(component.layout?.colSpan || 12)
                    : def.key === 'colSpanMd'
                    ? String(component.layout?.colSpanMd || component.layout?.colSpan || 12)
                    : def.key === 'colSpanSm'
                    ? String(component.layout?.colSpanSm || 12)
                    : def.key === 'minHeight'
                    ? String(component.layout?.minHeight || 'auto')
                    : ((component.layout as any)?.[def.key] ?? '');
                  return (
                    <RenderField
                      key={def.key}
                      def={def}
                      value={val}
                      onChange={(v) => onUpdateLayout(component.id, { [def.key]: ['colSpan', 'colSpanMd', 'colSpanSm'].includes(def.key) ? Number(v) : v } as any)}
                    />
                  );
                })}
              </div>

              {/* Visual column indicator */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Columns className="w-3 h-3 text-muted-foreground" />
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Width: {component.layout?.colSpan || 12}/12</label>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-4 rounded-sm cursor-pointer transition-all ${
                          i < (component.layout?.colSpan || 12)
                            ? 'bg-primary hover:bg-primary/80'
                            : 'bg-muted hover:bg-muted-foreground/20'
                        }`}
                        onClick={() => onUpdateLayout(component.id, { colSpan: i + 1 })}
                        title={`${i + 1} columns`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-0.5 px-0.5">
                    <span>1</span>
                    <span>6</span>
                    <span>12</span>
                  </div>
                </div>

                {/* Visual height indicator */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Height: {component.layout?.minHeight || 'auto'}</label>
                  </div>
                  <div className="flex gap-1">
                    {['auto', 'sm', 'md', 'lg', 'xl'].map(h => (
                      <button
                        key={h}
                        onClick={() => onUpdateLayout(component.id, { minHeight: h })}
                        className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all ${
                          (component.layout?.minHeight || 'auto') === h
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted hover:bg-accent text-muted-foreground'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
