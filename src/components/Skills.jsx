import { motion } from 'framer-motion';
import { useRef } from 'react';
import { FaHtml5, FaCss3Alt, FaReact, FaJava, FaPython, FaGithub, FaCode } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiMysql, SiSupabase } from 'react-icons/si';


const iconMap = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JAVASCRIPT: SiJavascript,
  REACT: FaReact,
  JAVA: FaJava,
  PYTHON: FaPython,
  'TAILWIND CSS': SiTailwindcss,
  
  'C#': FaCode,
  GITHUB: FaGithub,
  MYSQL: SiMysql,
  SUPABASE: SiSupabase
};

export default function Skills({ title = 'SKILLS & TOOLS', subtitle = 'Technologies I am learning and using.', skills = [] }) {

  // Build a stable years map per mount so "random" values don't change every render
  const yearsRef = useRef(null);
  if (!yearsRef.current) {
    const fixed = { HTML: 3, CSS: 3, JAVA: 4, MYSQL: 4 };
    const map = {};
    for (const s of skills) {
      const key = s.label.toUpperCase();
      if (fixed[key] != null) map[key] = fixed[key];
      else map[key] = 1 + Math.floor(Math.random() * 2); // 1-2 years
    }
    yearsRef.current = map;
  }

  if (typeof window !== 'undefined') {

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
            const years = yearsRef.current[s.label.toUpperCase()] ?? 1;
            const pct = Math.max(10, Math.min(100, Math.round((years / 4) * 100)));
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
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                  <Icon size={26} color={s.color || '#d6f26a'} />
                  <span>{s.label}</span>
                </div>
                <div style={{ marginTop: '.5rem' }} aria-label={`${s.label} experience ${years} year${years>1?'s':''}`}>
                  <div style={{ height: 6, background: '#222', borderRadius: 6, overflow: 'hidden', border: '1px solid #2a2a2a' }}>
                    <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg,#d6f26a,#b4d940)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <small style={{ color: '#aaa' }}>{years} yr{years>1?'s':''}</small>
                    <small style={{ color: '#666' }}>max 4</small>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
