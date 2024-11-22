declare module "som3aware" {
  export type Project = {
    id: string;
    url: string;
    title: string;
    logo: LucideIcon;
    featured: boolean;
    description: string;
  };

  export type NavigationItem = {
    name: string;
    href: string
  }
}
