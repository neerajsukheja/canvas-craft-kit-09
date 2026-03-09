import { Type, RectangleHorizontal, CreditCard, Box, LayoutGrid, TextCursor, Minus, User, ImageIcon, List, Layers } from 'lucide-react';
import type { ComponentType } from '@/types/builder';

const components: { type: ComponentType; label: string; icon: React.ElementType }[] = [
  { type: 'typography', label: 'Typography', icon: Type },
  { type: 'button', label: 'Button', icon: RectangleHorizontal },
  { type: 'card', label: 'Card', icon: CreditCard },
  { type: 'container', label: 'Container', icon: Box },
  { type: 'grid', label: 'Grid', icon: LayoutGrid },
  { type: 'textfield', label: 'TextField', icon: TextCursor },
  { type: 'divider', label: 'Divider', icon: Minus },
  { type: 'avatar', label: 'Avatar', icon: User },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'list', label: 'List', icon: List },
  { type: 'stack', label: 'Stack', icon: Layers },
];

interface Props {
  onDragStart: (type: ComponentType) => void;
}

export function ComponentLibrary({ onDragStart }: Props) {
  return (
    <div className="w-56 builder-panel border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Components</h2>
      </div>
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        {components.map(comp => (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('componentType', comp.type);
              onDragStart(comp.type);
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-grab hover:bg-accent transition-colors text-sm group"
          >
            <comp.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-medium">{comp.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
