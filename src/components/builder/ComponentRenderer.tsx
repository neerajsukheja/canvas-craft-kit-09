import type { BuilderComponent } from '@/types/builder';
import { CreditCard, Shield, TrendingUp, Home, DollarSign, Percent, PiggyBank, Briefcase, Star, Users, Phone, Globe } from 'lucide-react';

interface Props {
  component: BuilderComponent;
}

const iconMap: Record<string, React.ElementType> = {
  'credit-card': CreditCard,
  shield: Shield,
  'trending-up': TrendingUp,
  home: Home,
  'dollar-sign': DollarSign,
  percent: Percent,
  'piggy-bank': PiggyBank,
  briefcase: Briefcase,
  star: Star,
  users: Users,
  phone: Phone,
  globe: Globe,
};

export function ComponentRenderer({ component }: Props) {
  const { type, props } = component;

  switch (type) {
    case 'typography': {
      const variantMap: Record<string, string> = {
        h1: 'text-4xl font-bold leading-tight',
        h2: 'text-3xl font-semibold leading-tight',
        h3: 'text-2xl font-semibold',
        h4: 'text-xl font-medium',
        h5: 'text-lg font-medium',
        h6: 'text-base font-semibold',
        body1: 'text-base leading-relaxed',
        body2: 'text-sm leading-relaxed',
        caption: 'text-xs',
        overline: 'text-xs uppercase tracking-widest font-semibold',
      };
      const alignMap: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };
      const colorMap: Record<string, string> = {
        default: '',
        primary: 'text-primary',
        muted: 'text-muted-foreground',
        white: 'text-white',
        gold: 'text-gold',
      };
      const weightMap: Record<string, string> = {
        normal: '',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      };
      return (
        <p className={`${variantMap[props.variant as string] || 'text-base'} ${alignMap[props.align as string] || ''} ${colorMap[props.color as string] || ''} ${weightMap[props.weight as string] || ''}`}>
          {props.text as string}
        </p>
      );
    }

    case 'button': {
      const variantStyles: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary/5',
        ghost: 'bg-transparent text-primary hover:bg-primary/5',
        link: 'bg-transparent text-primary underline hover:no-underline p-0',
      };
      const sizeStyles: Record<string, string> = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base',
      };
      return (
        <button
          className={`inline-flex items-center justify-center rounded font-semibold transition-colors ${variantStyles[props.variant as string] || variantStyles.primary} ${sizeStyles[props.size as string] || sizeStyles.md} ${props.fullWidth ? 'w-full' : ''}`}
        >
          {props.label as string}
        </button>
      );
    }

    case 'card': {
      const Icon = props.icon && props.icon !== 'none' ? iconMap[props.icon as string] : null;
      const styleMap: Record<string, string> = {
        default: 'bg-card border border-border rounded-lg p-6 shadow-sm',
        bordered: 'bg-card border-2 border-border rounded-lg p-6',
        elevated: 'bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow',
        flat: 'bg-muted rounded-lg p-6',
        'icon-top': 'bg-card border border-border rounded-lg p-6 shadow-sm text-center',
      };
      return (
        <div className={styleMap[props.cardStyle as string] || styleMap.default}>
          {Icon && (
            <div className={`mb-4 ${props.cardStyle === 'icon-top' ? 'flex justify-center' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{props.title as string}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{props.description as string}</p>
        </div>
      );
    }

    case 'icon-card': {
      const Icon = props.icon ? iconMap[props.icon as string] : Star;
      return (
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              {Icon && <Icon className="w-7 h-7 text-primary" />}
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">{props.title as string}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{props.description as string}</p>
          {props.linkText && (
            <a className="text-sm font-semibold text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
              {props.linkText as string}
              <span className="text-xs">›</span>
            </a>
          )}
        </div>
      );
    }

    case 'navbar': {
      const links = (props.links as string || '').split(',').map(l => l.trim()).filter(Boolean);
      const styleMap: Record<string, { bg: string; text: string }> = {
        primary: { bg: 'bg-primary', text: 'text-primary-foreground' },
        white: { bg: 'bg-white border-b border-border', text: 'text-foreground' },
        dark: { bg: 'bg-foreground', text: 'text-background' },
      };
      const s = styleMap[props.navStyle as string] || styleMap.primary;
      return (
        <nav className={`${s.bg} ${s.text} px-6 py-3 flex items-center justify-between`}>
          <span className="font-bold text-lg tracking-wide">{props.brand as string}</span>
          <div className="flex items-center gap-6">
            {links.map((link, i) => (
              <span key={i} className="text-sm font-medium opacity-90 hover:opacity-100 cursor-pointer">{link}</span>
            ))}
          </div>
        </nav>
      );
    }

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
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{props.label as string}</label>
          <input
            type={props.type as string || 'text'}
            placeholder={props.placeholder as string}
            className="w-full border border-input rounded px-3 py-2.5 text-sm bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            readOnly
          />
        </div>
      );

    case 'divider': {
      const thicknessMap: Record<string, string> = { thin: 'border-t', medium: 'border-t-2', thick: 'border-t-4' };
      const colorMap: Record<string, string> = {
        default: 'border-border',
        primary: 'border-primary',
        gold: 'border-gold',
        light: 'border-border/50',
      };
      return <hr className={`${thicknessMap[props.thickness as string] || 'border-t'} ${colorMap[props.color as string] || 'border-border'} w-full`} />;
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

    case 'image': {
      const roundedMap: Record<string, string> = { none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };
      return (
        <img
          src={props.src as string || 'https://placehold.co/600x300/d71e28/ffffff?text=Image'}
          alt={props.alt as string}
          className={`w-full max-w-full ${roundedMap[props.rounded as string] || 'rounded-md'}`}
          style={{ objectFit: (props.objectFit as string) || 'cover' }}
        />
      );
    }

    case 'list': {
      const items = (props.items as string || '').split(',').map(i => i.trim()).filter(Boolean);
      const styleMap: Record<string, string> = {
        default: props.ordered ? 'list-decimal' : 'list-disc',
        checkmark: 'list-none',
        arrow: 'list-none',
        none: 'list-none',
      };
      const listStyle = props.listStyle as string || 'default';
      return (
        <ul className={`${styleMap[listStyle]} ${listStyle === 'default' ? 'pl-5' : 'pl-0'} space-y-2`}>
          {items.map((item, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              {listStyle === 'checkmark' && <span className="text-primary mt-0.5">✓</span>}
              {listStyle === 'arrow' && <span className="text-primary mt-0.5">›</span>}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case 'stack': {
      const dirMap: Record<string, string> = { row: 'flex-row', column: 'flex-col' };
      const gapMap: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
      const alignMap: Record<string, string> = { start: 'items-start', center: 'items-center', end: 'items-end' };
      return (
        <div className={`flex ${dirMap[props.direction as string] || 'flex-row'} ${gapMap[props.gap as string] || 'gap-4'} ${alignMap[props.align as string] || 'items-center'} ${props.wrap ? 'flex-wrap' : ''} border border-dashed border-border p-3 rounded-md min-h-[40px]`}>
          <span className="text-xs text-muted-foreground">Stack ({props.direction as string})</span>
        </div>
      );
    }

    default:
      return <div className="p-2 text-sm text-muted-foreground">Unknown component</div>;
  }
}
