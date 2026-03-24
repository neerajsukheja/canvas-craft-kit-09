import { useState, useCallback } from 'react';
import type { BuilderPage, BuilderComponent, BuilderSection, ComponentType, ComponentProps, LayoutProps, SectionLayout } from '@/types/builder';

let globalId = 1000;
const genId = (prefix: string) => `${prefix}-${++globalId}`;

const defaultLayout: LayoutProps = {
  colSpan: 12,
  padding: 'none',
  margin: 'none',
  alignSelf: 'stretch',
};

const defaultSectionLayout: SectionLayout = {
  columns: 12,
  gap: 'md',
  padding: 'md',
  background: 'white',
  maxWidth: 'xl',
  minHeight: 'auto',
};

const defaultProps: Record<ComponentType, ComponentProps> = {
  typography: { text: 'New Text', variant: 'body1', align: 'left', color: 'default', weight: 'normal' },
  button: { label: 'Button', variant: 'primary', size: 'md', fullWidth: false },
  card: { title: 'Card Title', description: 'Card description goes here.', cardStyle: 'default', icon: 'none' },
  container: { maxWidth: 'lg', padding: 'md' },
  grid: { columns: '2', gap: 'md' },
  textfield: { label: 'Label', placeholder: 'Enter text...', type: 'text' },
  divider: { thickness: 'thin', color: 'default' },
  avatar: { src: '', alt: 'Avatar', size: 'md' },
  image: { src: 'https://placehold.co/600x300/d71e28/ffffff?text=Image', alt: 'Image', objectFit: 'cover', rounded: 'md' },
  list: { items: 'Item 1,Item 2,Item 3', ordered: false, listStyle: 'default' },
  stack: { direction: 'row', gap: 'md', align: 'center', wrap: false },
  navbar: { brand: 'WELLS FARGO', links: 'Personal,Business,Commercial,Corporate', navStyle: 'primary' },
  'icon-card': { title: 'Feature Title', description: 'Feature description here.', linkText: 'Learn more', icon: 'star' },
};

export function useBuilder(initialPage: BuilderPage) {
  const [page, setPage] = useState<BuilderPage>(initialPage);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const selectedComponent = page.sections
    .flatMap(s => s.components)
    .find(c => c.id === selectedComponentId) || null;

  const selectedSection = page.sections.find(s => s.id === selectedSectionId) || null;

  const updatePage = useCallback((updater: (p: BuilderPage) => BuilderPage) => {
    setPage(prev => updater(prev));
  }, []);

  const addComponentToSection = useCallback((sectionId: string, componentType: ComponentType, index?: number) => {
    const newComp: BuilderComponent = {
      id: genId('comp'),
      type: componentType,
      props: { ...defaultProps[componentType] },
      layout: { ...defaultLayout },
    };
    updatePage(p => ({
      ...p,
      sections: p.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              components: index !== undefined
                ? [...s.components.slice(0, index), newComp, ...s.components.slice(index)]
                : [...s.components, newComp],
            }
          : s
      ),
    }));
    setSelectedComponentId(newComp.id);
    return newComp.id;
  }, [updatePage]);

  const moveComponent = useCallback((fromSectionId: string, toSectionId: string, componentId: string, toIndex: number) => {
    updatePage(p => {
      let comp: BuilderComponent | undefined;
      const withoutComp = p.sections.map(s => {
        if (s.id === fromSectionId) {
          const found = s.components.find(c => c.id === componentId);
          if (found) comp = found;
          return { ...s, components: s.components.filter(c => c.id !== componentId) };
        }
        return s;
      });
      if (!comp) return p;
      return {
        ...p,
        sections: withoutComp.map(s =>
          s.id === toSectionId
            ? { ...s, components: [...s.components.slice(0, toIndex), comp!, ...s.components.slice(toIndex)] }
            : s
        ),
      };
    });
  }, [updatePage]);

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    updatePage(p => {
      const sections = [...p.sections];
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      return { ...p, sections };
    });
  }, [updatePage]);

  const addSection = useCallback((index?: number) => {
    const newSection: BuilderSection = {
      id: genId('section'),
      name: 'New Section',
      style: 'wf-section',
      components: [],
      layout: { ...defaultSectionLayout },
    };
    updatePage(p => ({
      ...p,
      sections: index !== undefined
        ? [...p.sections.slice(0, index), newSection, ...p.sections.slice(index)]
        : [...p.sections, newSection],
    }));
    return newSection.id;
  }, [updatePage]);

  const deleteSection = useCallback((sectionId: string) => {
    updatePage(p => ({
      ...p,
      sections: p.sections.filter(s => s.id !== sectionId),
    }));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [updatePage, selectedSectionId]);

  const deleteComponent = useCallback((componentId: string) => {
    updatePage(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        components: s.components.filter(c => c.id !== componentId),
      })),
    }));
    if (selectedComponentId === componentId) setSelectedComponentId(null);
  }, [updatePage, selectedComponentId]);

  const updateComponentProps = useCallback((componentId: string, newProps: Partial<ComponentProps>) => {
    updatePage(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        components: s.components.map(c =>
          c.id === componentId ? { ...c, props: { ...c.props, ...newProps } } : c
        ),
      })),
    }));
  }, [updatePage]);

  const updateComponentLayout = useCallback((componentId: string, newLayout: Partial<LayoutProps>) => {
    updatePage(p => ({
      ...p,
      sections: p.sections.map(s => ({
        ...s,
        components: s.components.map(c =>
          c.id === componentId ? { ...c, layout: { ...c.layout, ...newLayout } } : c
        ),
      })),
    }));
  }, [updatePage]);

  const updateSectionLayout = useCallback((sectionId: string, newLayout: Partial<SectionLayout>) => {
    updatePage(p => ({
      ...p,
      sections: p.sections.map(s =>
        s.id === sectionId ? { ...s, layout: { ...s.layout, ...newLayout } } : s
      ),
    }));
  }, [updatePage]);

  const updateSectionName = useCallback((sectionId: string, name: string) => {
    updatePage(p => ({
      ...p,
      sections: p.sections.map(s =>
        s.id === sectionId ? { ...s, name } : s
      ),
    }));
  }, [updatePage]);

  const setPageDirect = useCallback((newPage: BuilderPage) => {
    setPage(newPage);
  }, []);

  return {
    page,
    setPageDirect,
    selectedComponent,
    selectedSection,
    selectedComponentId,
    selectedSectionId,
    setSelectedComponentId,
    setSelectedSectionId,
    addComponentToSection,
    moveComponent,
    reorderSections,
    addSection,
    deleteSection,
    deleteComponent,
    updateComponentProps,
    updateComponentLayout,
    updateSectionLayout,
    updateSectionName,
  };
}
