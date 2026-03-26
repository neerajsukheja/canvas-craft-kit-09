export type ComponentType =
  | 'typography'
  | 'button'
  | 'card'
  | 'container'
  | 'grid'
  | 'textfield'
  | 'divider'
  | 'avatar'
  | 'image'
  | 'list'
  | 'stack'
  | 'navbar'
  | 'icon-card';

export interface ComponentProps {
  [key: string]: string | number | boolean | string[];
}

export interface LayoutProps {
  colSpan: number;
  colSpanMd?: number;
  colSpanSm?: number;
  rowSpan?: number;
  minHeight?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  alignSelf?: string;
  textAlign?: string;
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  // Background & Border
  backgroundColor?: string;
  backgroundGradient?: string;
  borderWidth?: string;
  borderColor?: string;
  borderRadius?: string;
  borderStyle?: string;
  // Shadow
  boxShadow?: string;
  // Opacity
  opacity?: string;
  // Display
  overflow?: string;
  // Custom CSS
  customCSS?: string;
  // Direct color values
  textColor?: string;
  bgColor?: string;
  borderColorCustom?: string;
}

export interface SectionLayout {
  columns: number;
  gap: string;
  padding: string;
  background: string;
  maxWidth: string;
  minHeight?: string;
}

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  layout: LayoutProps;
}

export interface BuilderSection {
  id: string;
  name: string;
  style?: string;
  components: BuilderComponent[];
  layout: SectionLayout;
}

export interface BuilderPage {
  id: string;
  title: string;
  templateName: string;
  sections: BuilderSection[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  buildPage: () => BuilderPage;
}

export interface PropertyDefinition {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'boolean' | 'color';
  options?: string[];
}

export const COMPONENT_PROPERTY_DEFS: Record<ComponentType, PropertyDefinition[]> = {
  typography: [
    { key: 'text', label: 'Text', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'overline'] },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'color', label: 'Color', type: 'select', options: ['default', 'primary', 'muted', 'white', 'gold'] },
    { key: 'weight', label: 'Weight', type: 'select', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
    { key: 'textTransform', label: 'Transform', type: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'] },
    { key: 'textDecoration', label: 'Decoration', type: 'select', options: ['none', 'underline', 'line-through'] },
  ],
  button: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive'] },
    { key: 'size', label: 'Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { key: 'fullWidth', label: 'Full Width', type: 'boolean' },
    { key: 'rounded', label: 'Rounded', type: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    { key: 'icon', label: 'Icon', type: 'select', options: ['none', 'arrow-right', 'plus', 'download', 'external-link', 'check', 'star'] },
    { key: 'iconPosition', label: 'Icon Position', type: 'select', options: ['left', 'right'] },
  ],
  card: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'cardStyle', label: 'Style', type: 'select', options: ['default', 'bordered', 'elevated', 'flat', 'icon-top', 'glass', 'gradient'] },
    { key: 'icon', label: 'Icon', type: 'select', options: ['none', 'credit-card', 'shield', 'trending-up', 'home', 'dollar-sign', 'percent', 'piggy-bank', 'briefcase', 'star'] },
    { key: 'hover', label: 'Hover Effect', type: 'select', options: ['none', 'lift', 'glow', 'scale'] },
  ],
  container: [
    { key: 'maxWidth', label: 'Max Width', type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    { key: 'padding', label: 'Padding', type: 'select', options: ['none', 'sm', 'md', 'lg'] },
    { key: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid'] },
    { key: 'flexDirection', label: 'Flex Direction', type: 'select', options: ['row', 'column'] },
    { key: 'justifyContent', label: 'Justify', type: 'select', options: ['start', 'center', 'end', 'between', 'around'] },
    { key: 'alignItems', label: 'Align Items', type: 'select', options: ['start', 'center', 'end', 'stretch'] },
  ],
  grid: [
    { key: 'columns', label: 'Columns', type: 'select', options: ['1', '2', '3', '4', '5', '6'] },
    { key: 'gap', label: 'Gap', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    { key: 'autoFit', label: 'Auto Fit', type: 'boolean' },
  ],
  textfield: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] },
    { key: 'required', label: 'Required', type: 'boolean' },
    { key: 'helperText', label: 'Helper Text', type: 'text' },
    { key: 'inputSize', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
  ],
  divider: [
    { key: 'thickness', label: 'Thickness', type: 'select', options: ['thin', 'medium', 'thick'] },
    { key: 'color', label: 'Color', type: 'select', options: ['default', 'primary', 'gold', 'light', 'dark'] },
    { key: 'style', label: 'Style', type: 'select', options: ['solid', 'dashed', 'dotted'] },
    { key: 'width', label: 'Width', type: 'select', options: ['full', '3/4', '1/2', '1/4'] },
  ],
  avatar: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'size', label: 'Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { key: 'shape', label: 'Shape', type: 'select', options: ['circle', 'square', 'rounded'] },
    { key: 'border', label: 'Border', type: 'boolean' },
  ],
  image: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'objectFit', label: 'Fit', type: 'select', options: ['cover', 'contain', 'fill', 'none'] },
    { key: 'rounded', label: 'Rounded', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', 'full'] },
    { key: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '1:1', '4:3', '16:9', '21:9'] },
    { key: 'shadow', label: 'Shadow', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  ],
  list: [
    { key: 'items', label: 'Items (comma-separated)', type: 'text' },
    { key: 'ordered', label: 'Ordered', type: 'boolean' },
    { key: 'listStyle', label: 'Style', type: 'select', options: ['default', 'checkmark', 'arrow', 'none', 'numbered', 'dot'] },
    { key: 'spacing', label: 'Spacing', type: 'select', options: ['tight', 'normal', 'relaxed'] },
  ],
  stack: [
    { key: 'direction', label: 'Direction', type: 'select', options: ['row', 'column'] },
    { key: 'gap', label: 'Gap', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    { key: 'align', label: 'Align', type: 'select', options: ['start', 'center', 'end', 'stretch'] },
    { key: 'justify', label: 'Justify', type: 'select', options: ['start', 'center', 'end', 'between', 'around'] },
    { key: 'wrap', label: 'Wrap', type: 'boolean' },
  ],
  navbar: [
    { key: 'brand', label: 'Brand Name', type: 'text' },
    { key: 'links', label: 'Links (comma-separated)', type: 'text' },
    { key: 'navStyle', label: 'Style', type: 'select', options: ['primary', 'white', 'dark', 'transparent', 'glass'] },
    { key: 'sticky', label: 'Sticky', type: 'boolean' },
    { key: 'centered', label: 'Centered Links', type: 'boolean' },
  ],
  'icon-card': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'linkText', label: 'Link Text', type: 'text' },
    { key: 'icon', label: 'Icon', type: 'select', options: ['credit-card', 'shield', 'trending-up', 'home', 'dollar-sign', 'percent', 'piggy-bank', 'briefcase', 'star', 'users', 'phone', 'globe', 'heart', 'zap', 'award'] },
    { key: 'iconPosition', label: 'Icon Position', type: 'select', options: ['top', 'left', 'right'] },
    { key: 'hover', label: 'Hover Effect', type: 'select', options: ['none', 'lift', 'glow'] },
  ],
};

export const LAYOUT_PROPERTY_DEFS: PropertyDefinition[] = [
  { key: 'colSpan', label: 'Column Span (lg)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
  { key: 'colSpanMd', label: 'Column Span (md)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
  { key: 'colSpanSm', label: 'Column Span (sm)', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
  { key: 'minHeight', label: 'Min Height', type: 'select', options: ['auto', 'sm', 'md', 'lg', 'xl'] },
  { key: 'alignSelf', label: 'Align Self', type: 'select', options: ['start', 'center', 'end', 'stretch'] },
];

export const SPACING_PROPERTY_DEFS: PropertyDefinition[] = [
  { key: 'padding', label: 'Padding (all)', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
  { key: 'paddingTop', label: 'Padding Top', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'paddingRight', label: 'Padding Right', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'paddingBottom', label: 'Padding Bottom', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'paddingLeft', label: 'Padding Left', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'margin', label: 'Margin (all)', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'marginTop', label: 'Margin Top', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'marginBottom', label: 'Margin Bottom', type: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
];

export const TYPOGRAPHY_LAYOUT_DEFS: PropertyDefinition[] = [
  { key: 'fontFamily', label: 'Font Family', type: 'select', options: ['inherit', 'Inter', 'Georgia', 'monospace', 'serif', 'sans-serif'] },
  { key: 'fontSize', label: 'Font Size', type: 'select', options: ['inherit', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] },
  { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['inherit', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold'] },
  { key: 'lineHeight', label: 'Line Height', type: 'select', options: ['inherit', 'tight', 'snug', 'normal', 'relaxed', 'loose'] },
  { key: 'letterSpacing', label: 'Letter Spacing', type: 'select', options: ['inherit', 'tighter', 'tight', 'normal', 'wide', 'wider', 'widest'] },
];

export const STYLE_PROPERTY_DEFS: PropertyDefinition[] = [
  { key: 'backgroundColor', label: 'Background Color', type: 'select', options: ['none', 'white', 'light', 'dark', 'primary', 'primary-light', 'gold-light', 'accent'] },
  { key: 'backgroundGradient', label: 'Gradient', type: 'select', options: ['none', 'primary-to-dark', 'dark-to-light', 'gold-shimmer', 'blue-purple', 'sunset'] },
  { key: 'borderWidth', label: 'Border Width', type: 'select', options: ['none', '1', '2', '4'] },
  { key: 'borderColor', label: 'Border Color', type: 'select', options: ['default', 'primary', 'muted', 'gold', 'transparent'] },
  { key: 'borderRadius', label: 'Border Radius', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] },
  { key: 'borderStyle', label: 'Border Style', type: 'select', options: ['solid', 'dashed', 'dotted', 'none'] },
  { key: 'boxShadow', label: 'Box Shadow', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'inner'] },
  { key: 'opacity', label: 'Opacity', type: 'select', options: ['100', '90', '75', '50', '25', '10'] },
  { key: 'overflow', label: 'Overflow', type: 'select', options: ['visible', 'hidden', 'auto', 'scroll'] },
];

export const SECTION_LAYOUT_DEFS: PropertyDefinition[] = [
  { key: 'columns', label: 'Grid Columns', type: 'select', options: ['1', '2', '3', '4', '6', '12'] },
  { key: 'gap', label: 'Gap', type: 'select', options: ['none', 'sm', 'md', 'lg'] },
  { key: 'padding', label: 'Padding', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  { key: 'background', label: 'Background', type: 'select', options: ['transparent', 'white', 'light', 'dark', 'primary', 'primary-light', 'gold-light'] },
  { key: 'maxWidth', label: 'Max Width', type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
  { key: 'minHeight', label: 'Min Height', type: 'select', options: ['auto', 'sm', 'md', 'lg'] },
];
