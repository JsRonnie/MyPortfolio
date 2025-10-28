import { useEffect, useState } from 'react';

// We'll treat skills + projects as one combined navigation item.
const SECTION_IDS = ['home','about','skills','projects','experience','contact'];

export default function Header(){
    const [active, setActive] = useState('home');

        useEffect(() => {
                // Smooth, non-jumpy scroll-spy: pick the section whose CENTER is closest to a viewport focus line
                const els = SECTION_IDS
                    .map(id => document.getElementById(id))
                    .filter(Boolean);

                let rafId = null;
                const onScroll = () => {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = requestAnimationFrame(() => {
                        const focusY = window.scrollY + window.innerHeight * 0.4; // a little above vertical center
                        let bestId = 'home';
                        let bestDist = Infinity;
                        for (const el of els) {
                            const rect = el.getBoundingClientRect();
                            const center = window.scrollY + rect.top + rect.height / 2;
                            const d = Math.abs(center - focusY);
                            if (d < bestDist) { bestDist = d; bestId = el.id; }
                        }
                        setActive(prev => (prev === bestId ? prev : bestId));
                    });
                };

                window.addEventListener('scroll', onScroll, { passive: true });
                // Run once on mount
                onScroll();
                return () => {
                    window.removeEventListener('scroll', onScroll);
                    if (rafId) cancelAnimationFrame(rafId);
                };
        }, []);

    // Determine active states; combine logic for skills/projects.
    const combinedActive = active === 'skills' || active === 'projects';

    return (
      <nav className="navDiv">
        <a href="#home" className="brand">Kian Aaron Bungao</a>
        <ul>
          <li><a href="#home" className={active === 'home' ? 'active-nav' : ''}>Home</a></li>
          <li><a href="#about" className={active === 'about' ? 'active-nav' : ''}>About</a></li>
          <li><a href="#skills" className={combinedActive ? 'active-nav' : ''}>Skills/Project</a></li>
          <li><a href="#experience" className={active === 'experience' ? 'active-nav' : ''}>Experience</a></li>
          <li><a href="#contact" className={active === 'contact' ? 'active-nav' : ''}>Contact</a></li>
        </ul>
      </nav>
    );
}