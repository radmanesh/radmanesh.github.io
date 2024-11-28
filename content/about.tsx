import { SectionItem } from "som3aware";

const ABOUT = {
  education: [
    {
      image: "asu.webp",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2023-12-31"),
      entity: "Arizona State University",
      description: "Masters of Science in Engineering in Software Engineering",
    },
    {
      image: "auc.webp",
      startDate: new Date("2014-09-01"),
      endDate: new Date("2019-08-01"),
      entity: "The American University in Cairo",
      description: "Bachelor of Science in Computer Engineering",
    },
  ],
  experience: [
    {
      image: "reconciled.webp",
      startDate: new Date("2024-01-01"),
      endDate: "present",
      entity: "Reconciled",
      description:
        "Building the first reverse invoice management platform for staffing agencies",
    },
    {
      image: "nodogoro.webp",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2023-12-31"),
      entity: "Nodogoro",
      description:
        "Worked on building multiple AI-powered apps using OpenAI, LangChain and Next.js",
    },
    {
      image: "new-smart-egypt.webp",
      startDate: new Date("2024-01-01"),
      endDate: "present",
      entity: "New Smart Egypt",
      description:
        "Worked on building web/mobile apps & developing APIs to integrate between multiple systems including Odoo & ZKTeco",
    },
    {
      image: "vois.webp",
      startDate: new Date("2024-01-01"),
      endDate: "present",
      entity: "VOIS",
      description:
        "Worked on building and providing technical support for multiple web apps including HR Management System, Covid-19 tracker & CRM",
    },
  ],
} satisfies Record<"education" | "experience", SectionItem[]>;

export default ABOUT;
