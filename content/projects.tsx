import { Project } from "portfolioManager";
import {
  Boxes,
  Bug,
  Command,
  Hash,
  Megaphone,
  PencilRuler,
  ScanFace,
  ShoppingCart,
} from "lucide-react";

const PROJECTS = [
  {
    id:'1',
    featured: true,
    title: "Jamasp",
    url: "https://jamasp.app/",
    logo: <Command className="project-logo" />,
    description: "A platform to collect ana analyze participants wearable devices data"
  },
  {
    id: "2",
    featured: true,
    title: "Cut (Lens)",
    url: "https://cust.social/",
    logo: <PencilRuler className="project-logo" />,
    description: "A platform to collect and analyze psychological and behavioral data",
  },
] satisfies Project[];

export default PROJECTS;
