declare module "som3aware" {
  export type Project = {
    id: string;
    title: string;
    logoPath: string;
    codeLink: string;
    previewLink: string;
    description: string;
    stackIconPath: string;
    technologies: string[];
  };
}
