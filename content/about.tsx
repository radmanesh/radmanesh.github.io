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
        "Founding Engineer",
    },
    {
      image: "nodogoro.webp",
      startDate: new Date("2023-05-15"),
      endDate: new Date("2023-12-31"),
      entity: "Nodogoro",
      description:
        "Software Engineer II",
    },
    {
      image: "new-smart-egypt.webp",
      startDate: new Date("2021-11-01"),
      endDate: new Date("2023-05-14"),
      entity: "New Smart Egypt",
      description:
        "Software Engineer I",
    },
    {
      image: "vois.webp",
      startDate: new Date("2020-07-01"),
      endDate: new Date("2021-10-30"),
      entity: "VOIS",
      description:
        "Software Engineer",
    },
  ],
} satisfies Record<"education" | "experience", SectionItem[]>;

export default ABOUT;
