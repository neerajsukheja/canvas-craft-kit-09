import { Type, RectangleHorizontal, CreditCard, Box, LayoutGrid, TextCursor, Minus, User, ImageIcon, List, Layers, Navigation, Star } from 'lucide-react';
import type { ComponentType } from '@/types/builder';

const componentGroups: { label: string; items: { type: ComponentType; label: string; icon: React.ElementType }[] }[] = [
  {
    label: 'Layout',
    items: [
      { type: 'navbar', label: 'Navbar', icon: Navigation },
      { type: 'container', label: 'Container', icon: Box },
      { type: 'grid', label: 'Grid', icon: LayoutGrid },
      { type: 'stack', label: 'Stack', icon: Layers },
      { type: 'divider', label: 'Divider', icon: Minus },
    ],
  },
  {
    label: 'Content',
    items: [
      { type: 'typography', label: 'Typography', icon: Type },
      { type: 'image', label: 'Image', icon: ImageIcon },
      { type: 'avatar', label: 'Avatar', icon: User },
      { type: 'list', label: 'List', icon: List },
    ],
  },
  {
    label: 'Interactive',
    items: [
      { type: 'button', label: 'Button', icon: RectangleHorizontal },
      { type: 'textfield', label: 'TextField', icon: TextCursor },
    ],
  },
  {
    label: 'Cards',
    items: [
      { type: 'card', label: 'Card', icon: CreditCard },
      { type: 'icon-card', label: 'Icon Card', icon: Star },
    ],
  },
];

interface Props {
  onDragStart: (type: ComponentType) => void;
}

export function ComponentLibrary({ onDragStart }: Props) {
  return (
    <div className="w-60 builder-panel border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Components</h2>
      </div>
      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {componentGroups.map(group => (
          <div key={group.label}>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1.5">{group.label}</h3>
            <div className="space-y-0.5">
              {group.items.map(comp => (
                <div
                  key={comp.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('componentType', comp.type);
                    onDragStart(comp.type);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-grab hover:bg-accent active:bg-accent/80 transition-colors text-sm group"
                >
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <comp.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-xs">{comp.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
