import type { BuilderComponent, ComponentProps } from '@/types/builder';
import { COMPONENT_PROPERTY_DEFS } from '@/types/builder';
import { Settings2 } from 'lucide-react';

interface Props {
  component: BuilderComponent | null;
  onUpdateProps: (id: string, props: Partial<ComponentProps>) => void;
}

export function PropertiesPanel({ component, onUpdateProps }: Props) {
  if (!component) {
    return (
      <div className="w-64 builder-panel border-l border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <Settings2 className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a component to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const defs = COMPONENT_PROPERTY_DEFS[component.type] || [];

  return (
    <div className="w-64 builder-panel border-l border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Properties</h2>
        <span className="text-xs text-primary font-medium mt-1 block capitalize">{component.type}</span>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {defs.map(def => (
          <div key={def.key} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{def.label}</label>
            {def.type === 'text' && (
              <input
                type="text"
                value={(component.props[def.key] as string) || ''}
                onChange={e => onUpdateProps(component.id, { [def.key]: e.target.value })}
                className="w-full border border-input rounded-md px-2.5 py-1.5 text-sm bg-background focus:ring-1 focus:ring-ring outline-none"
              />
            )}
            {def.type === 'select' && (
              <select
                value={(component.props[def.key] as string) || ''}
                onChange={e => onUpdateProps(component.id, { [def.key]: e.target.value })}
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
                value={(component.props[def.key] as number) || 0}
                onChange={e => onUpdateProps(component.id, { [def.key]: Number(e.target.value) })}
                className="w-full border border-input rounded-md px-2.5 py-1.5 text-sm bg-background focus:ring-1 focus:ring-ring outline-none"
              />
            )}
            {def.type === 'boolean' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!component.props[def.key]}
                  onChange={e => onUpdateProps(component.id, { [def.key]: e.target.checked })}
                  className="rounded border-input accent-primary"
                />
                <span className="text-sm">Enabled</span>
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
