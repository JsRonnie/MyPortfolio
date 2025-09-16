import { motion } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaReact, FaJava, FaPython, FaGithub, FaCode } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiMysql, SiSupabase } from 'react-icons/si';

// Map skill keys to icon components
const iconMap = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JAVASCRIPT: SiJavascript,
  REACT: FaReact,
  JAVA: FaJava,
  PYTHON: FaPython,
  'TAILWIND CSS': SiTailwindcss,
  // 'C#': SiCsharp is not exported in the installed react-icons build; using a generic code icon instead.
  'C#': FaCode,
  GITHUB: FaGithub,
  MYSQL: SiMysql,
  SUPABASE: SiSupabase
};

export default function Skills({ title = 'SKILLS & TOOLS', subtitle = 'Technologies I am learning and using.', skills = [] }) {
  // Debug: log skills passed (remove later)
  if (typeof window !== 'undefined') {
    // Only log once per mount
    if (!window.__loggedSkillsOnce) {
      console.log('Skills received:', skills.map(s => s.label));
      window.__loggedSkillsOnce = true;
    }
  }
  return (
    <section id="skills" style={{ background: '#111', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.7rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>{title}</h2>
          <p style={{ color: '#ccc', marginTop: '0.85rem', maxWidth: '560px', lineHeight: 1.45 }}>{subtitle}</p>
        </div>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
          }}
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            justifyItems: 'center'
          }}
        >
          {skills.map((s) => {
            const Icon = iconMap[s.label.toUpperCase()] || FaGithub;
            return (
              <motion.li
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4, scale: 1.03 }}
                style={{
                  background: '#181818',
                  border: '1px solid #222',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.6rem',
                  fontWeight: 500,
                  fontSize: '.9rem',
                  letterSpacing: '.5px',
                  cursor: 'default',
                  width: '100%',
                  maxWidth: '170px',
                  justifyContent: 'flex-start'
                }}
              >
                <Icon size={26} color={s.color || '#d6f26a'} />
                <span>{s.label}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
