import { useMemo } from "react";
import Header from "./components/Header";
import Herosec from "./components/HeroSec";
import AboutMe from "./components/AboutMeAndCapabilities";
import ExperienceAndContact from "./components/ExperienceAndContact";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import dabreederImage from "./assets/dabreeder.png";
import votingImage from "./assets/voting.png";
import "./App.css";

const DEFAULT_PROJECT_IMAGE = "https://placehold.co/600x400/111111/FFFFFF?text=Project";

function App() {
  const skills = useMemo(
    () => [
      { label: "ASP.NET CORE WEB API", color: "#8b5cf6", category: "Backend", accent: "Core stack" },
      { label: "C#", color: "#a78bfa", category: "Backend", accent: "Primary language" },
      { label: "RESTFUL APIS", color: "#38bdf8", category: "Backend", accent: "API design" },
      { label: "AUTHENTICATION & AUTHORIZATION", color: "#f59e0b", category: "Concepts", accent: "Security" },
      { label: "ERROR HANDLING", color: "#fb7185", category: "Concepts", accent: "Reliability" },
      { label: "LOGGING", color: "#4ade80", category: "Concepts", accent: "Observability" },
      { label: "MICROSERVICES INTEGRATION", color: "#c084fc", category: "Concepts", accent: "System design" },
      { label: "MYSQL", color: "#22d3ee", category: "Database", accent: "Data layer" },
      { label: "POSTGRESQL", color: "#60a5fa", category: "Database", accent: "Relational" },
      { label: "SQL SERVER", color: "#ef4444", category: "Database", accent: "Enterprise DB" },
      { label: "SUPABASE", color: "#34d399", category: "Tools", accent: "BaaS" },
      { label: "POSTMAN", color: "#fb923c", category: "Tools", accent: "API testing" },
      { label: "SWAGGER", color: "#a3e635", category: "Tools", accent: "Docs" },
      { label: "GIT", color: "#f97316", category: "Tools", accent: "Version control" },
      { label: "GITHUB", color: "#e5e7eb", category: "Tools", accent: "Collaboration" },
      { label: "REACT", color: "#61dafb", category: "Frontend", accent: "Interfaces" },
      { label: "JAVASCRIPT", color: "#facc15", category: "Frontend", accent: "Client logic" },
      { label: "HTML", color: "#f97316", category: "Frontend", accent: "Structure" },
      { label: "CSS", color: "#38bdf8", category: "Frontend", accent: "Responsive UI" }
    ],
    []
  );

  const projects = useMemo(
    () => [
      {
        id: "p1",
        name: "Dog Match Platform",
        description:
          "Capstone full-stack web app for dog owners and breeders that evaluates compatibility using trait-based matching, role-aware access, messaging, and discussion features.",
        tech: ["React", "Supabase", "PostgreSQL", "Authentication", "Role-based Access"],
        badge: "CAPSTONE",
        imageUrl: dabreederImage,
        link: "https://dabreeder.vercel.app/"
      },
      {
        id: "p2",
        name: "Student Voting System",
        description:
          "Voting platform with role-based flows, ballot security, and live results. Built to practice frontend delivery while working with auth rules and structured data.",
        tech: ["React", "Supabase", "RLS", "Auth", "Responsive UI"],
        badge: "FULL STACK",
        imageUrl: votingImage,
        link: "https://studvote.vercel.app/"
      },
      {
        id: "p3",
        name: "Backend API Work",
        description:
          "ASP.NET Core Web API internship work focused on secure endpoints, JWT authentication, parameterized SQL queries, exception handling, logging, and service integration.",
        tech: ["ASP.NET Core", "C#", "JWT", "MySQL", "REST APIs"],
        badge: "INTERNSHIP",
        imageUrl: DEFAULT_PROJECT_IMAGE
      }
    ],
    []
  );

  return (
    <>
      <Header />
      <Herosec />
      <AboutMe />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <ExperienceAndContact />
    </>
  );
}

export default App;
