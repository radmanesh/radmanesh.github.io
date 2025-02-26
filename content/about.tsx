import { Education, Experience } from "som3aware";

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
      period: { to: "present", from: "Jan, 2024" },
      company: { name: "Reconciled", url: "https://reconciled.io" },
      role: {
        title: "Founding Engineer",
        description:
          "Building the first reverse invoice management platform for staffing agencies",
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
      company: { name: "VOIS", url: "" },
      period: { to: "Oct, 2021", from: "Jul, 2020" },
      role: {
        title: "Software Engineer",
        description:
          "Worked on building and providing technical support for multiple web apps",
      },
    },
  ],
} satisfies
  | Record<"education", Education[]>
  | Record<"experience", Experience[]>;

export default ABOUT;
