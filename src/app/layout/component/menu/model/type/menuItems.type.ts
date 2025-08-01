export type itemsMenu = {
  label: string;
  items: items[];
  roles: string[];
};
export type items = {
  label: string;
  icon: string;
  routerLink?: string[];
  roles?: string[];
  items?: items[];
};
