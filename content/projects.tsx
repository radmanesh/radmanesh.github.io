import { Project } from "som3aware";
import { Boxes, Hash, PencilRuler } from "lucide-react";

const PROJECTS = [
  {
    id: "1",
    featured: true,
    title: "Editor Setup",
    url: "https://editorsetup.vercel.app/",
    logo: <PencilRuler className="project-logo" />,
    description: "Find your next optimal VS Code Setup.",
  },
  {
    id: "2",
    featured: true,
    title: "Sharp Studio",
    url: "https://sharpstudio.vercel.app/",
    logo: <Hash className="project-logo" />,
    description: "Hackable Image Processing.",
  },
  {
    id: "3",
    featured: true,
    title: "Open Trivia",
    url: "https://open-trivia-demo.vercel.app/",
    logo: <Boxes className="project-logo" />,
    description: "Multi-round trivia game built with Open Trivia API.",
  },
] satisfies Project[];

export default PROJECTS;
