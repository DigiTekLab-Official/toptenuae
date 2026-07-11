// src/types/site/navigation.ts
export interface NavigationLink {
  _key?: string;
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavigationLink[];
}

export interface NavigationMenu {
  _id: string;
  title?: string;
  items: NavigationLink[];
}