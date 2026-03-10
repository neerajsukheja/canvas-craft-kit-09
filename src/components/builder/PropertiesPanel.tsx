import type { BuilderComponent, BuilderSection, ComponentProps, LayoutProps, SectionLayout } from '@/types/builder';
import { COMPONENT_PROPERTY_DEFS, LAYOUT_PROPERTY_DEFS, SECTION_LAYOUT_DEFS } from '@/types/builder';
import { Settings2 } from 'lucide-react';

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
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{def.label}</label>
      {def.type === 'text' && (
        <input
          type="text"
          value={(value as string) || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-input rounded-md px-2.5 py-1.5 text-sm bg-background focus:ring-1 focus:ring-ring outline-none"
        />
      )}
      {def.type === 'select' && (
        <select
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-input rounded-md px-2.5 py-1.5 text-sm bg-background focus:ring-1 focus:ring-ring outline-none"
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
          className="w-full border border-input rounded-md px-2.5 py-1.5 text-sm bg-background focus:ring-1 focus:ring-ring outline-none"
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
          <span className="text-sm">Enabled</span>
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
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Settings2 className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a component or section to edit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 builder-panel border-l border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Properties</h2>
      </div>
      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Section properties */}
        {section && !component && (
          <>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Section</span>
              <RenderField
                def={{ key: 'name', label: 'Name', type: 'text' }}
                value={section.name}
                onChange={(val) => onUpdateSectionName(section.id, val as string)}
              />
            </div>
            <div className="border-t border-border pt-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Layout</span>
              <div className="space-y-3">
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
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-3">{component.type}</span>
              <div className="space-y-3">
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
            <div className="border-t border-border pt-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Layout (Bootstrap Grid)</span>
              <div className="space-y-3">
                {LAYOUT_PROPERTY_DEFS.map(def => {
                  const val = def.key === 'colSpan'
                    ? String(component.layout?.colSpan || 12)
                    : def.key === 'colSpanMd'
                    ? String(component.layout?.colSpanMd || component.layout?.colSpan || 12)
                    : def.key === 'colSpanSm'
                    ? String(component.layout?.colSpanSm || 12)
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
              <div className="mt-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Column Preview</label>
                <div className="grid grid-cols-12 gap-0.5">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-sm cursor-pointer transition-colors ${
                        i < (component.layout?.colSpan || 12)
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                      onClick={() => onUpdateLayout(component.id, { colSpan: i + 1 })}
                      title={`${i + 1} columns`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  <span>1</span>
                  <span>6</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
