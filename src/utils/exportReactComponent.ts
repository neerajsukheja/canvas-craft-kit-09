import type { BuilderPage, BuilderComponent, BuilderSection } from '@/types/builder';

function escapeJsx(str: string): string {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function generateComponentJsx(comp: BuilderComponent, indent: string): string {
  const { type, props, layout } = comp;
  const span = layout?.colSpan || 12;
  const mdSpan = layout?.colSpanMd || span;
  const smSpan = layout?.colSpanSm || 12;

  const colClass = `col-span-${smSpan} md:col-span-${mdSpan} lg:col-span-${span}`;

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
      const tag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(props.variant as string) ? props.variant as string : 'p';
      const classes = `${colClass} ${variantMap[props.variant as string] || 'text-base'} ${alignMap[props.align as string] || ''}`.trim();
      return `${indent}<${tag} className="${classes}">${escapeJsx(props.text as string)}</${tag}>`;
    }

    case 'button': {
      const variantStyles: Record<string, string> = {
        primary: 'bg-red-600 text-white hover:bg-red-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
        ghost: 'text-red-600 hover:bg-red-50',
        link: 'text-red-600 underline hover:no-underline p-0',
      };
      const sizeStyles: Record<string, string> = {
        sm: 'px-4 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-8 py-3 text-base',
      };
      const classes = `${colClass} inline-flex items-center justify-center rounded font-semibold transition-colors ${variantStyles[props.variant as string] || variantStyles.primary} ${sizeStyles[props.size as string] || sizeStyles.md} ${props.fullWidth ? 'w-full' : ''}`.trim();
      return `${indent}<button className="${classes}">${escapeJsx(props.label as string)}</button>`;
    }

    case 'card': {
      const styleMap: Record<string, string> = {
        default: 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm',
        bordered: 'bg-white border-2 border-gray-200 rounded-lg p-6',
        elevated: 'bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow',
        flat: 'bg-gray-50 rounded-lg p-6',
        'icon-top': 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center',
      };
      const classes = `${colClass} ${styleMap[props.cardStyle as string] || styleMap.default}`;
      return `${indent}<div className="${classes}">
${indent}  <h3 className="text-lg font-semibold mb-2">${escapeJsx(props.title as string)}</h3>
${indent}  <p className="text-sm text-gray-500 leading-relaxed">${escapeJsx(props.description as string)}</p>
${indent}</div>`;
    }

    case 'icon-card':
      return `${indent}<div className="${colClass} bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
${indent}  <div className="mb-4">
${indent}    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
${indent}      {/* Icon: ${props.icon} */}
${indent}    </div>
${indent}  </div>
${indent}  <h3 className="text-lg font-semibold mb-2">${escapeJsx(props.title as string)}</h3>
${indent}  <p className="text-sm text-gray-500 leading-relaxed mb-3">${escapeJsx(props.description as string)}</p>
${indent}  ${props.linkText ? `<a href="#" className="text-sm font-semibold text-red-600 hover:underline">${escapeJsx(props.linkText as string)} ›</a>` : ''}
${indent}</div>`;

    case 'navbar': {
      const links = (props.links as string || '').split(',').map(l => l.trim()).filter(Boolean);
      const bgStyle = props.navStyle === 'primary' ? 'bg-red-600 text-white' : props.navStyle === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-b border-gray-200';
      return `${indent}<nav className="${colClass} ${bgStyle} px-6 py-3 flex items-center justify-between">
${indent}  <span className="font-bold text-lg tracking-wide">${escapeJsx(props.brand as string)}</span>
${indent}  <div className="flex items-center gap-6">
${links.map(l => `${indent}    <a href="#" className="text-sm font-medium opacity-90 hover:opacity-100">${escapeJsx(l)}</a>`).join('\n')}
${indent}  </div>
${indent}</nav>`;
    }

    case 'textfield':
      return `${indent}<div className="${colClass} space-y-1.5">
${indent}  <label className="text-sm font-medium">${escapeJsx(props.label as string)}</label>
${indent}  <input type="${props.type || 'text'}" placeholder="${escapeJsx(props.placeholder as string)}" className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none" />
${indent}</div>`;

    case 'image':
      return `${indent}<img src="${escapeJsx(props.src as string)}" alt="${escapeJsx(props.alt as string)}" className="${colClass} w-full rounded-md object-cover" />`;

    case 'divider':
      return `${indent}<hr className="${colClass} border-gray-200" />`;

    case 'list': {
      const items = (props.items as string || '').split(',').map(i => i.trim()).filter(Boolean);
      return `${indent}<ul className="${colClass} space-y-2">
${items.map(item => `${indent}  <li className="text-sm flex items-start gap-2"><span className="text-red-600">›</span> ${escapeJsx(item)}</li>`).join('\n')}
${indent}</ul>`;
    }

    default:
      return `${indent}<div className="${colClass}">{/* ${type} component */}</div>`;
  }
}

function generateSectionJsx(section: BuilderSection, indent: string): string {
  const sl = section.layout;
  const bgMap: Record<string, string> = {
    transparent: '', white: 'bg-white', light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white', primary: 'bg-red-600 text-white',
    'primary-light': 'bg-red-50', 'gold-light': 'bg-yellow-50',
  };
  const paddingMap: Record<string, string> = {
    none: '', sm: 'py-4 px-4', md: 'py-8 px-6', lg: 'py-12 px-8', xl: 'py-16 px-12',
  };
  const gapMap: Record<string, string> = {
    none: 'gap-0', sm: 'gap-2', md: 'gap-4', lg: 'gap-6',
  };
  const maxWMap: Record<string, string> = {
    sm: 'max-w-2xl', md: 'max-w-4xl', lg: 'max-w-6xl', xl: 'max-w-7xl', full: 'max-w-full',
  };

  const sectionBg = bgMap[sl?.background] || '';
  const sectionPadding = paddingMap[sl?.padding] || '';
  const sectionGap = gapMap[sl?.gap] || 'gap-4';
  const sectionMaxW = maxWMap[sl?.maxWidth] || 'max-w-7xl';

  const components = section.components.map(c => generateComponentJsx(c, indent + '      ')).join('\n');

  return `${indent}  {/* ${section.name} */}
${indent}  <section className="${sectionBg} ${sectionPadding}".trim()>
${indent}    <div className="${sectionMaxW} mx-auto">
${indent}      <div className="grid grid-cols-12 ${sectionGap}">
${components}
${indent}      </div>
${indent}    </div>
${indent}  </section>`;
}

export function exportAsReactComponent(page: BuilderPage): string {
  const componentName = page.title.replace(/[^a-zA-Z0-9]/g, '') + 'Page';

  const sections = page.sections.map(s => generateSectionJsx(s, '    ')).join('\n\n');

  return `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-white">
${sections}
    </div>
  );
};

export default ${componentName};
`;
}
