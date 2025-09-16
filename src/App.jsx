import Header from "./components/Header";
import Herosec from "./components/HeroSec";
import AboutMe from "./components/AboutMeAndCapabilities";
import ExperienceAndContact from "./components/ExperienceAndContact";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import './App.css'

function App() {
  const skills = [
    { label: 'HTML', color: '#e44d26' },
    { label: 'CSS', color: '#1572B6' },
    { label: 'JAVASCRIPT', color: '#f7df1e' },
    { label: 'REACT', color: '#61dafb' },
    { label: 'TAILWIND CSS', color: '#38bdf8' },
    { label: 'JAVA', color: '#f89820' },
    { label: 'PYTHON', color: '#3776AB' },
    { label: 'C#', color: '#9b4f96' },
    { label: 'GITHUB', color: '#d6f26a' },
    // Adjusted colors for better contrast on dark background
    { label: 'MYSQL', color: '#11A6D3' },
    { label: 'SUPABASE', color: '#4BEFA4' }
  ];

  const projects = [
    {
      id: 'p1',
      name: 'Student Voting System',
      description: 'A role-based campus voting platform allowing students to securely vote, with admin result dashboards and audit logs.',
      tech: ['Java', 'MySQL', 'JDBC', 'Servlets'],
      badge: 'JAVA / MYSQL'
    },
    {
      id: 'p2',
      name: 'Service Booking System',
      description: 'Scheduling & reservation system supporting time slots, availability validation, and booking history tracking.',
      tech: ['JavaScript', 'Node (optional)', 'Responsive UI'],
      badge: 'BOOKING'
    },
    {
      id: 'p3',
      name: 'Dog Match (Physical Traits)',
      description: 'Matches user preferences (size, coat, energy, temperament) to breeds using a trait scoring algorithm.',
      tech: ['Data Filtering', 'Trait Scoring', 'UI'],
      badge: 'MATCHING'
    }
  ];

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

export default App
