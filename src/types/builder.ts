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
  colSpan: number;       // 1-12 grid columns
  rowSpan?: number;
  padding?: string;      // none, sm, md, lg, xl
  margin?: string;       // none, sm, md, lg
  alignSelf?: string;    // start, center, end, stretch
  textAlign?: string;    // left, center, right
}

export interface SectionLayout {
  columns: number;       // grid template columns (1-12)
  gap: string;           // none, sm, md, lg
  padding: string;       // none, sm, md, lg, xl
  background: string;    // transparent, white, light, dark, primary, primary-light, gold-light
  maxWidth: string;      // sm, md, lg, xl, full
  minHeight?: string;    // auto, sm, md, lg
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
  type: 'text' | 'select' | 'number' | 'boolean';
  options?: string[];
}

export const COMPONENT_PROPERTY_DEFS: Record<ComponentType, PropertyDefinition[]> = {
  typography: [
    { key: 'text', label: 'Text', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'overline'] },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
    { key: 'color', label: 'Color', type: 'select', options: ['default', 'primary', 'muted', 'white', 'gold'] },
    { key: 'weight', label: 'Weight', type: 'select', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
  ],
  button: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'link'] },
    { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
    { key: 'fullWidth', label: 'Full Width', type: 'boolean' },
  ],
  card: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'cardStyle', label: 'Style', type: 'select', options: ['default', 'bordered', 'elevated', 'flat', 'icon-top'] },
    { key: 'icon', label: 'Icon', type: 'select', options: ['none', 'credit-card', 'shield', 'trending-up', 'home', 'dollar-sign', 'percent', 'piggy-bank', 'briefcase', 'star'] },
  ],
  container: [
    { key: 'maxWidth', label: 'Max Width', type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    { key: 'padding', label: 'Padding', type: 'select', options: ['none', 'sm', 'md', 'lg'] },
  ],
  grid: [
    { key: 'columns', label: 'Columns', type: 'select', options: ['1', '2', '3', '4'] },
    { key: 'gap', label: 'Gap', type: 'select', options: ['sm', 'md', 'lg'] },
  ],
  textfield: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'placeholder', label: 'Placeholder', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['text', 'email', 'password', 'number'] },
  ],
  divider: [
    { key: 'thickness', label: 'Thickness', type: 'select', options: ['thin', 'medium', 'thick'] },
    { key: 'color', label: 'Color', type: 'select', options: ['default', 'primary', 'gold', 'light'] },
  ],
  avatar: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
  ],
  image: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'objectFit', label: 'Fit', type: 'select', options: ['cover', 'contain', 'fill'] },
    { key: 'rounded', label: 'Rounded', type: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
  ],
  list: [
    { key: 'items', label: 'Items (comma-separated)', type: 'text' },
    { key: 'ordered', label: 'Ordered', type: 'boolean' },
    { key: 'listStyle', label: 'Style', type: 'select', options: ['default', 'checkmark', 'arrow', 'none'] },
  ],
  stack: [
    { key: 'direction', label: 'Direction', type: 'select', options: ['row', 'column'] },
    { key: 'gap', label: 'Gap', type: 'select', options: ['sm', 'md', 'lg'] },
    { key: 'align', label: 'Align', type: 'select', options: ['start', 'center', 'end'] },
    { key: 'wrap', label: 'Wrap', type: 'boolean' },
  ],
  navbar: [
    { key: 'brand', label: 'Brand Name', type: 'text' },
    { key: 'links', label: 'Links (comma-separated)', type: 'text' },
    { key: 'navStyle', label: 'Style', type: 'select', options: ['primary', 'white', 'dark'] },
  ],
  'icon-card': [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'linkText', label: 'Link Text', type: 'text' },
    { key: 'icon', label: 'Icon', type: 'select', options: ['credit-card', 'shield', 'trending-up', 'home', 'dollar-sign', 'percent', 'piggy-bank', 'briefcase', 'star', 'users', 'phone', 'globe'] },
  ],
};

export const LAYOUT_PROPERTY_DEFS: PropertyDefinition[] = [
  { key: 'colSpan', label: 'Column Span', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
  { key: 'padding', label: 'Padding', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  { key: 'margin', label: 'Margin', type: 'select', options: ['none', 'sm', 'md', 'lg'] },
  { key: 'alignSelf', label: 'Align Self', type: 'select', options: ['start', 'center', 'end', 'stretch'] },
];

export const SECTION_LAYOUT_DEFS: PropertyDefinition[] = [
  { key: 'columns', label: 'Grid Columns', type: 'select', options: ['1', '2', '3', '4', '6', '12'] },
  { key: 'gap', label: 'Gap', type: 'select', options: ['none', 'sm', 'md', 'lg'] },
  { key: 'padding', label: 'Padding', type: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  { key: 'background', label: 'Background', type: 'select', options: ['transparent', 'white', 'light', 'dark', 'primary', 'primary-light', 'gold-light'] },
  { key: 'maxWidth', label: 'Max Width', type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
  { key: 'minHeight', label: 'Min Height', type: 'select', options: ['auto', 'sm', 'md', 'lg'] },
];
