declare module "portfolioManager" {
  export type Project = {
    id: string;
    url: string;
    title: string;
    logo: LucideIcon;
    featured: boolean;
    description: string;
  };

  export type NavigationItem = { name: string; href: string };

  export type Education = {
    id: string;
    period: Period;
    degree: string;
    institute: string;
  };

  export type Experience = {
    id: string;
    role: Role;
    period: Period;
    company: Company;
  };

  export type Social = {
    href: string;
    title: string;
  };

  // un-exported
  type Period = { from: string; to: string };
  type Company = { name: string; url: string };
  type Role = { title: string; description: string };
}
