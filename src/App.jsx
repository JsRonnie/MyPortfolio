import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Herosec from "./components/HeroSec";
import AboutMe from "./components/AboutMeAndCapabilities";
import ExperienceAndContact from "./components/ExperienceAndContact";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import dabreederImage from "./assets/dabreeder.png";
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
      description: 'A role-based campus voting platform built with HTML, CSS, Java, MySQL, and custom API endpoints for secure ballots and audit trails.',
      tech: ['HTML', 'CSS', 'Java', 'MySQL', 'API'],
      badge: 'FULL-STACK CAPSTONE',
      imageUrl: DEFAULT_PROJECT_IMAGE
    },
    {
      id: 'p2',
      name: 'Service Booking System',
      description: 'Scheduling & reservation system supporting time slots, availability validation, and booking history tracking built with HTML, CSS, MySQL, and Java.',
      tech: ['HTML', 'CSS', 'MySQL', 'Java'],
      badge: 'BOOKING',
      imageUrl: DEFAULT_PROJECT_IMAGE
    },
    {
      id: 'p3',
      name: 'Dog Match (Physical Traits)',
      description: 'Capstone DaBreeder pairs user preferences (size, coat, energy, temperament) to breeds using a trait scoring algorithm built with Supabase, Tailwind CSS, HTML, React.js, and JavaScript.',
      tech: ['Supabase', 'Tailwind CSS', 'HTML', 'React.js', 'JavaScript'],
      badge: 'DABREEDER CAPSTONE',
      imageUrl: dabreederImage,
      link: 'https://dabreeder.vercel.app/'
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
          imageUrl: p.image_url || DEFAULT_PROJECT_IMAGE,
          link: p.link ?? p.link_url ?? p.project_url ?? p.demo_url ?? ''
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
