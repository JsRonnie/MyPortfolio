import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Herosec from "./components/HeroSec";
import AboutMe from "./components/AboutMeAndCapabilities";
import ExperienceAndContact from "./components/ExperienceAndContact";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import { supabase } from "./lib/supabaseClient";
import { useViewerTracker } from "./hooks/useViewerTracker";
import './App.css'

const DEFAULT_PROJECT_IMAGE = 'https://placehold.co/600x400/111111/FFFFFF?text=Project';

function App() {
  useViewerTracker();

  const skills = useMemo(() => ([
    { label: 'HTML', color: '#e44d26' },
    { label: 'CSS', color: '#1572B6' },
    { label: 'JAVASCRIPT', color: '#f7df1e' },
    { label: 'REACT', color: '#61dafb' },
    { label: 'TAILWIND CSS', color: '#38bdf8' },
    { label: 'JAVA', color: '#f89820' },
    { label: 'PYTHON', color: '#3776AB' },
    { label: 'C#', color: '#9b4f96' },
    { label: 'GITHUB', color: '#d6f26a' },
    { label: 'MYSQL', color: '#11A6D3' },
    { label: 'SUPABASE', color: '#4BEFA4' }
  ]), []);

  const fallbackProjects = useMemo(() => ([
    {
      id: 'p1',
      name: 'Student Voting System',
      description: 'A role-based campus voting platform allowing students to securely vote, with admin result dashboards and audit logs.',
      tech: ['Java', 'MySQL', 'JDBC', 'Servlets'],
      badge: 'JAVA / MYSQL',
      imageUrl: DEFAULT_PROJECT_IMAGE
    },
    {
      id: 'p2',
      name: 'Service Booking System',
      description: 'Scheduling & reservation system supporting time slots, availability validation, and booking history tracking.',
      tech: ['JavaScript', 'Node (optional)', 'Responsive UI'],
      badge: 'BOOKING',
      imageUrl: DEFAULT_PROJECT_IMAGE
    },
    {
      id: 'p3',
      name: 'Dog Match (Physical Traits)',
      description: 'Matches user preferences (size, coat, energy, temperament) to breeds using a trait scoring algorithm.',
      tech: ['Data Filtering', 'Trait Scoring', 'UI'],
      badge: 'MATCHING',
      imageUrl: DEFAULT_PROJECT_IMAGE
    }
  ]), []);

  const [projects, setProjects] = useState(fallbackProjects);
  const [projectsLoading, setProjectsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let ignore = false;
    async function loadProjects() {
      setProjectsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!ignore && !error && Array.isArray(data) && data.length > 0) {
        const normalized = data.map(p => ({
          id: p.id,
          name: p.title ?? 'Untitled Project',
          description: p.description ?? '',
          tech: p.tech_stack ?? [],
          badge: p.badge ?? (p.tech_stack?.[0] || ''),
          imageUrl: p.image_url || DEFAULT_PROJECT_IMAGE
        }));
        setProjects(normalized);
      }
      setProjectsLoading(false);
    }
    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Header />
      <Herosec />
      <AboutMe />
      <Skills skills={skills} />
      <Projects projects={projectsLoading ? [] : projects} />
      <ExperienceAndContact />
    </>
  );
}

export default App
