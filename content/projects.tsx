import {
  Brain,
  Watch,
} from "lucide-react";
import { Project } from "portfolioManager";

const PROJECTS = [
  {
    id: "1",
    featured: true,
    title: "Jamasp",
    url: "https://jamasp.app/",
    logo: <Watch className="project-logo" />,
    description: "A platform to collect ana analyze participants wearable devices data"
  },
  {
    id: "2",
    featured: true,
    title: "Cut (Lens)",
    url: "https://cut.social/",
    logo: <Brain className="project-logo" />,
    description: "A framework to build and run psychological and behavioral studies",
  },
] satisfies Project[];

export default PROJECTS;
