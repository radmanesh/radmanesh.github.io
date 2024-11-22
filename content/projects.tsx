import { Project } from "som3aware";

const GITHUB_BASE_URL = "https://github.com";

export default [
  {
    id: "1",
    title: "Editor Setup",
    description: "Find your next optimal VS Code Setup.",
    codeLink: `${GITHUB_BASE_URL}/${process.env.GITHUB_USERNAME}/editor-setup`,
    previewLink: "https://editor-setup.vercel.app",
    logoPath: "/projects/editor-setup-logo.sv",
    stackIconPath: "",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
  },
] satisfies Project[];
