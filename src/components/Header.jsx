import { useEffect, useState } from 'react';

// We'll treat skills + projects as one combined navigation item.
const SECTION_IDS = ['home','about','skills','projects','experience','contact'];

export default function Header(){
    const [active, setActive] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);

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

        useEffect(() => {
                const onResize = () => {
                        if (window.innerWidth > 768) {
                                setMenuOpen(false);
                        }
                };
                window.addEventListener('resize', onResize);
                return () => window.removeEventListener('resize', onResize);
        }, []);

        useEffect(() => {
                if (!menuOpen) return undefined;
                const onKeyDown = (evt) => {
                        if (evt.key === 'Escape') {
                                setMenuOpen(false);
                        }
                };
                window.addEventListener('keydown', onKeyDown);
                return () => window.removeEventListener('keydown', onKeyDown);
        }, [menuOpen]);

    // Determine active states; combine logic for skills/projects.
    const combinedActive = active === 'skills' || active === 'projects';
        const handleNavClick = () => setMenuOpen(false);
        const toggleMenu = () => setMenuOpen(prev => !prev);

    return (
            <nav className={`navDiv ${menuOpen ? 'nav-open' : ''}`}>
                <div className="nav-brand-row">
                    <a href="#home" className="brand">Kian Aaron Bungao</a>
                    <button
                        type="button"
                        className="nav-toggle"
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                        onClick={toggleMenu}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
                <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <li><a href="#home" className={active === 'home' ? 'active-nav' : ''} onClick={handleNavClick}>Home</a></li>
                    <li><a href="#about" className={active === 'about' ? 'active-nav' : ''} onClick={handleNavClick}>About</a></li>
                    <li><a href="#skills" className={combinedActive ? 'active-nav' : ''} onClick={handleNavClick}>Skills/Project</a></li>
                    <li><a href="#experience" className={active === 'experience' ? 'active-nav' : ''} onClick={handleNavClick}>Experience</a></li>
                    <li><a href="#contact" className={active === 'contact' ? 'active-nav' : ''} onClick={handleNavClick}>Contact</a></li>
                </ul>
            </nav>
    );
}