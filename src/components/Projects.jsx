import { motion } from 'framer-motion';

// Projects section now supports real data (description, tech tags, badge) while still
// falling back to three simple "Coming Soon" placeholders if no projects are passed.
export default function Projects({ title = 'PROJECTS', subtitle = 'Highlighted recent work & ideas', projects = [] }) {
  const placeholders = [
    { id: 'ph1', name: 'Coming Soon', description: '', tech: [], badge: '' },
    { id: 'ph2', name: 'Coming Soon', description: '', tech: [], badge: '' },
    { id: 'ph3', name: 'Coming Soon', description: '', tech: [], badge: '' }
  ];
  const list = (projects && projects.length > 0) ? projects.slice(0, 3) : placeholders;

  return (
    <section id="projects" style={{ background: '#111', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.7rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>{title}</h2>
          <p style={{ color: '#ccc', marginTop: '0.85rem', maxWidth: '620px', lineHeight: 1.5 }}>{subtitle}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.15 } }}
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.65rem'
          }}
        >
          {list.map(p => {
            const isPlaceholder = p.name === 'Coming Soon';
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }}
                whileHover={{ y: -6, boxShadow: '0 10px 26px -8px rgba(0,0,0,.65)' }}
                style={{
                  background: 'linear-gradient(145deg,#1b1b1b 0%, #141414 100%)',
                  border: '1px solid #232323',
                  borderRadius: '20px',
                  padding: '1.5rem 1.3rem 1.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '.9rem',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '180px'
                }}
              >
                {p.badge && !isPlaceholder && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '12px',
                    background: 'linear-gradient(90deg,#3b82f6,#6366f1)',
                    fontSize: '.6rem',
                    letterSpacing: '1px',
                    padding: '.35rem .55rem',
                    borderRadius: '999px',
                    fontWeight: 600
                  }}>{p.badge}</span>
                )}
                <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 600, letterSpacing: '.5px', textAlign: 'center', width: '100%' }}>{p.name}</h3>
                {!isPlaceholder && p.description && (
                  <p style={{ margin: 0, fontSize: '.85rem', lineHeight: 1.4, color: '#b5b5b5', textAlign: 'center' }}>{p.description}</p>
                )}
                {!isPlaceholder && p.tech && p.tech.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem', justifyContent: 'center' }}>
                    {p.tech.slice(0, 6).map(t => (
                      <span key={t} style={{
                        background: '#222',
                        border: '1px solid #2d2d2d',
                        padding: '.35rem .55rem',
                        borderRadius: '8px',
                        fontSize: '.6rem',
                        letterSpacing: '.5px',
                        fontWeight: 500,
                        color: '#d4d4d4'
                      }}>{t}</span>
                    ))}
                  </div>
                )}
                {isPlaceholder && (
                  <div style={{
                    marginTop: '.25rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '.7rem',
                    letterSpacing: '.75px',
                    color: '#888',
                    fontWeight: 500
                  }}>Stay Tuned</div>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
