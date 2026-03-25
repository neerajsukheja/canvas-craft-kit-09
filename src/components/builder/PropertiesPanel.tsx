import type { BuilderComponent, BuilderSection, ComponentProps, LayoutProps, SectionLayout } from '@/types/builder';
import { COMPONENT_PROPERTY_DEFS, LAYOUT_PROPERTY_DEFS, SPACING_PROPERTY_DEFS, TYPOGRAPHY_LAYOUT_DEFS, STYLE_PROPERTY_DEFS, SECTION_LAYOUT_DEFS } from '@/types/builder';
import { Settings2, Columns, ArrowUpDown, Type, Paintbrush, Box, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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
      {(def.type === 'text' || def.type === 'color') && (
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

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-border pt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full py-1.5 hover:bg-accent/50 rounded-md px-1 transition-colors"
      >
        {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
          <Icon className="w-3 h-3 text-muted-foreground" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</span>
      </button>
      {isOpen && <div className="space-y-2.5 mt-2 pl-1">{children}</div>}
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
      <div className="p-3 space-y-2 overflow-y-auto flex-1">
        {/* Section properties */}
        {section && !component && (
          <>
            <div className="space-y-2 px-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Section</span>
              <RenderField
                def={{ key: 'name', label: 'Name', type: 'text' }}
                value={section.name}
                onChange={(val) => onUpdateSectionName(section.id, val as string)}
              />
            </div>
            <CollapsibleSection title="Layout" icon={Columns} defaultOpen>
              {SECTION_LAYOUT_DEFS.map(def => (
                <RenderField
                  key={def.key}
                  def={def}
                  value={(section.layout as any)?.[def.key] ?? ''}
                  onChange={(val) => onUpdateSectionLayout(section.id, { [def.key]: def.key === 'columns' ? Number(val) : val } as any)}
                />
              ))}
            </CollapsibleSection>
          </>
        )}

        {/* Component properties */}
        {component && (
          <>
            {/* Component-specific props */}
            <CollapsibleSection title={component.type} icon={Settings2} defaultOpen>
              {(COMPONENT_PROPERTY_DEFS[component.type] || []).map(def => (
                <RenderField
                  key={def.key}
                  def={def}
                  value={component.props[def.key] as string | number | boolean}
                  onChange={(val) => onUpdateProps(component.id, { [def.key]: val })}
                />
              ))}
            </CollapsibleSection>

            {/* Grid Layout */}
            <CollapsibleSection title="Grid Layout" icon={Columns} defaultOpen>
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
              {/* Visual column indicator */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Width: {component.layout?.colSpan || 12}/12</label>
                </div>
                <div className="grid grid-cols-12 gap-0.5">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-3.5 rounded-sm cursor-pointer transition-all ${
                        i < (component.layout?.colSpan || 12)
                          ? 'bg-primary hover:bg-primary/80'
                          : 'bg-muted hover:bg-muted-foreground/20'
                      }`}
                      onClick={() => onUpdateLayout(component.id, { colSpan: i + 1 })}
                      title={`${i + 1} columns`}
                    />
                  ))}
                </div>
              </div>
              {/* Height buttons */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Height: {component.layout?.minHeight || 'auto'}</label>
                <div className="flex gap-1">
                  {['auto', 'sm', 'md', 'lg', 'xl'].map(h => (
                    <button
                      key={h}
                      onClick={() => onUpdateLayout(component.id, { minHeight: h })}
                      className={`flex-1 py-1 text-[10px] font-medium rounded-md transition-all ${
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
            </CollapsibleSection>

            {/* Spacing */}
            <CollapsibleSection title="Spacing" icon={Box}>
              {SPACING_PROPERTY_DEFS.map(def => (
                <RenderField
                  key={def.key}
                  def={def}
                  value={(component.layout as any)?.[def.key] ?? 'none'}
                  onChange={(v) => onUpdateLayout(component.id, { [def.key]: v } as any)}
                />
              ))}
            </CollapsibleSection>

            {/* Typography */}
            <CollapsibleSection title="Typography" icon={Type}>
              {TYPOGRAPHY_LAYOUT_DEFS.map(def => (
                <RenderField
                  key={def.key}
                  def={def}
                  value={(component.layout as any)?.[def.key] ?? 'inherit'}
                  onChange={(v) => onUpdateLayout(component.id, { [def.key]: v } as any)}
                />
              ))}
            </CollapsibleSection>

            {/* Style (Background, Border, Shadow) */}
            <CollapsibleSection title="Background & Border" icon={Paintbrush}>
              {STYLE_PROPERTY_DEFS.map(def => (
                <RenderField
                  key={def.key}
                  def={def}
                  value={(component.layout as any)?.[def.key] ?? (def.options?.[0] || '')}
                  onChange={(v) => onUpdateLayout(component.id, { [def.key]: v } as any)}
                />
              ))}
            </CollapsibleSection>
          </>
        )}
      </div>
    </div>
  );
}
