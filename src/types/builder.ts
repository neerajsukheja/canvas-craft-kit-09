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
  | 'stack';

export interface ComponentProps {
  [key: string]: string | number | boolean | string[];
}

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

export interface BuilderSection {
  id: string;
  name: string;
  style?: string; // CSS class to apply
  components: BuilderComponent[];
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
    { key: 'variant', label: 'Variant', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption'] },
    { key: 'align', label: 'Alignment', type: 'select', options: ['left', 'center', 'right'] },
  ],
  button: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'variant', label: 'Variant', type: 'select', options: ['primary', 'secondary', 'outline'] },
    { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
  ],
  card: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
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
  ],
  avatar: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
  ],
  image: [
    { key: 'src', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
    { key: 'width', label: 'Width', type: 'text' },
  ],
  list: [
    { key: 'items', label: 'Items (comma-separated)', type: 'text' },
    { key: 'ordered', label: 'Ordered', type: 'boolean' },
  ],
  stack: [
    { key: 'direction', label: 'Direction', type: 'select', options: ['row', 'column'] },
    { key: 'gap', label: 'Gap', type: 'select', options: ['sm', 'md', 'lg'] },
    { key: 'align', label: 'Align', type: 'select', options: ['start', 'center', 'end'] },
  ],
};
