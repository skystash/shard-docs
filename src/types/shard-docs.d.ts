type content = {
  type: 'category' | 'document' | 'link';
  name: string;
  url?: string;
  external?: boolean;
  items?: contentItem[]
  document?: unknown;
}[]

type categoryItem = {
  type: 'category';
  name: string | null;
  path: string;
  items: (categoryItem | documentItem | linkItem)[];
  isEmpty: boolean,
  isActive: boolean,
  depth: number
}

type documentItem = {
  type: 'document';
  name: string;
  path: string;
  document: string | React.ReactNode;
  breadcrumbs: breadcrumb[];
  isEmpty: boolean,
  isActive: boolean,
  depth: number
}

type linkItem = {
  type: 'link';
  name: string;
  url: string;
  external: boolean;
  depth: number
}

type tree = (categoryItem | documentItem | linkItem)[]

type breadcrumb = {
  path: string,
  name: string,
  isActive: boolean
}

type paginationPage = {
  name: string,
  path: string
}
