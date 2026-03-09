import type { BuilderComponent } from '@/types/builder';

interface Props {
  component: BuilderComponent;
}

export function ComponentRenderer({ component }: Props) {
  const { type, props } = component;

  switch (type) {
    case 'typography': {
      const variantMap: Record<string, string> = {
        h1: 'text-4xl font-bold',
        h2: 'text-3xl font-semibold',
        h3: 'text-2xl font-semibold',
        h4: 'text-xl font-medium',
        h5: 'text-lg font-medium',
        h6: 'text-base font-medium',
        body1: 'text-base',
        body2: 'text-sm',
        caption: 'text-xs text-muted-foreground',
      };
      const alignMap: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };
      return (
        <p className={`${variantMap[props.variant as string] || 'text-base'} ${alignMap[props.align as string] || ''}`}>
          {props.text as string}
        </p>
      );
    }

    case 'button': {
      const variantStyles: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-background text-foreground hover:bg-accent',
      };
      const sizeStyles: Record<string, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      };
      return (
        <button
          className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${variantStyles[props.variant as string] || variantStyles.primary} ${sizeStyles[props.size as string] || sizeStyles.md}`}
        >
          {props.label as string}
        </button>
      );
    }

    case 'card':
      return (
        <div className="wf-card">
          <h3 className="text-lg font-semibold mb-2">{props.title as string}</h3>
          <p className="text-sm text-muted-foreground">{props.description as string}</p>
        </div>
      );

    case 'container':
      return (
        <div className="border border-dashed border-border rounded-md p-4 min-h-[40px]">
          <span className="text-xs text-muted-foreground">Container</span>
        </div>
      );

    case 'grid':
      return (
        <div className="border border-dashed border-border rounded-md p-4 min-h-[40px]">
          <span className="text-xs text-muted-foreground">Grid ({props.columns as string} columns)</span>
        </div>
      );

    case 'textfield':
      return (
        <div className="space-y-1 max-w-sm">
          <label className="text-sm font-medium">{props.label as string}</label>
          <input
            type={props.type as string || 'text'}
            placeholder={props.placeholder as string}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
            readOnly
          />
        </div>
      );

    case 'divider': {
      const thicknessMap: Record<string, string> = { thin: 'border-t', medium: 'border-t-2', thick: 'border-t-4' };
      return <hr className={`${thicknessMap[props.thickness as string] || 'border-t'} border-border w-full`} />;
    }

    case 'avatar': {
      const sizeMap: Record<string, string> = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
      return (
        <div className={`${sizeMap[props.size as string] || 'w-12 h-12'} rounded-full bg-muted flex items-center justify-center overflow-hidden`}>
          {props.src ? (
            <img src={props.src as string} alt={props.alt as string} className="w-full h-full object-cover" />
          ) : (
            <span className="text-muted-foreground text-xs">AV</span>
          )}
        </div>
      );
    }

    case 'image':
      return (
        <img
          src={props.src as string || 'https://placehold.co/600x300/d71e28/ffffff?text=Image'}
          alt={props.alt as string}
          style={{ width: props.width as string || '100%' }}
          className="rounded-md max-w-full"
        />
      );

    case 'list': {
      const items = (props.items as string || '').split(',').map(i => i.trim()).filter(Boolean);
      const Tag = props.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`${props.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1`}>
          {items.map((item, i) => (
            <li key={i} className="text-sm">{item}</li>
          ))}
        </Tag>
      );
    }

    case 'stack': {
      const dirMap: Record<string, string> = { row: 'flex-row', column: 'flex-col' };
      const gapMap: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
      const alignMap: Record<string, string> = { start: 'items-start', center: 'items-center', end: 'items-end' };
      return (
        <div className={`flex ${dirMap[props.direction as string] || 'flex-row'} ${gapMap[props.gap as string] || 'gap-4'} ${alignMap[props.align as string] || 'items-center'} border border-dashed border-border p-3 rounded-md min-h-[40px]`}>
          <span className="text-xs text-muted-foreground">Stack ({props.direction as string})</span>
        </div>
      );
    }

    default:
      return <div className="p-2 text-sm text-muted-foreground">Unknown component</div>;
  }
}
