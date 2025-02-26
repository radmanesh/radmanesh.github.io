import { Education, Experience } from "portfolioManager";

const ABOUT = {
  education: [
    {
      id: "1",
      institute: "The University of Oklahoma",
      period: { from: "Jan, 2024", to: "Dec, 2026" },
      degree: "Masters of Science in Data Science and Analytics",
    },
    {
      id: "2",
      institute: "Amirkabir University of Technology",
      period: { from: "Sep, 2004", to: "Aug, 2011" },
      degree: "Bachelor of Science in Software Engineering",
    },
  ],
  experience: [
    {
      id: "1",
      period: { to: "present", from: "2022" },
      company: { name: "New School for Social Research", url: "https://cut.social" },
      role: {
        title: "Developer/Researcher",
        description:
          "Working on two projects: 1. cut.social, a psychological and behavioral research platform, 2. som3aware, a knowledge engineering and AI platform",
      },
    },
    {
      id: "2",
      period: { to: "Dec, 2023", from: "May, 2023" },
      company: { name: "Nodogoro", url: "https://www.nodogoro.com/" },
      role: {
        title: "Software Engineer II",
        description:
          "Developed multiple AI-powered applications using OpenAI, LangChain and Next.js",
      },
    },
    {
      id: "3",
      period: { to: "May, 2023", from: "Nov, 2021" },
      company: {
        name: "New Smart Egypt",
        url: "https://www.linkedin.com/company/new-smart-egypt-integrated-solutions",
      },
      role: {
        title: "Software Engineer I",
        description:
          "Worked on building web/mobile apps and integrating between multiple vendor systems",
      },
    },
    {
      id: "4",
      company: { name: "ICT Research institute", url: "https://en.itrc.ac.ir/" },
      period: { to: "2012", from: "2013" },
      role: {
        title: "Research Engineer/Developer",
        description:
          "Developed an experimental knowledge engineering and semantic methods, primarily focused on ontology and logic.",
      },
    },
  ],
} satisfies
  | Record<"education", Education[]>
  | Record<"experience", Experience[]>;

export default ABOUT;
