

// This file defines the TypeScript interface for a project object.

// It includes properties for project details, overview, features, technologies used, and lessons learned.

// Define the enum values for project status

export type TProjectStatus = "completed" | "in-progress" | "planned";

// Define the enum values for project categories
export type TProjectCategory =
  | "web-development"
  | "mobile-app"
  | "data-science"
  | "machine-learning"
  | "game-development"
  | "devops"
  | "ui-ux-design"
  | "other"
  | "full-stack-development"
  | "cloud-computing"
  | "cybersecurity"
  | "blockchain"
  | "internet-of-things"
  | "artificial-intelligence"
  | "augmented-reality"
  | "virtual-reality"
  | "natural-language-processing"
  | "big-data"
  | "edge-computing"
  | "quantum-computing"
  | "robotics"
  | "automation"
  | "e-commerce"
  | "social-media"
  | "content-management"
  | "enterprise-software"
  | "healthcare-technology"
  | "fintech"
  | "education-technology"
  | "travel-technology"
  | "real-time-communication"
  | "supply-chain-management"
  | "digital-marketing"
  | "search-engine-optimization"
  | "mobile-game-development"
  | "web-game-development"
  | "desktop-application";

// Restrict the month abbreviation
export type TMonth =
  | "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun"
  | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

// Allowed years: from 2020 to 2030 (you can extend this)
export type TYear =
  | "2020" | "2021" | "2022" | "2023" | "2024" | "2025"
  | "2026" | "2027" | "2028" | "2029" | "2030";

// Timeframe format: "Mon YYYY – Mon YYYY"
export type TTimeframe = `${TMonth} ${TYear} – ${TMonth} ${TYear}`;


// Define the interface for the project object
export interface TProject  {
 basicInfo:{
   title: string;
  slug: string;
  description: string;
 },
 meta:{
   status: TProjectStatus;
  category: TProjectCategory;
  client: string;
  timeframe: TTimeframe;
 },
  links:{
    githubUrl: string;
  liveDemoUrl?: string;
  }
  overview: {
    context: string;
    targetAudience: string;
    objectives: string[];
  };
  screenshots: string[]; // URLs or file paths to screenshots
  features: string[];
  technologies: {
    frontend: string;
    backend: string;
    database: string;
    realTime: string;
    deployment: string;
    thirdPartyAPI: string;
  };
  lessonsLearned: string[];
}
