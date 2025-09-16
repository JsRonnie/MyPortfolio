import { useEffect, useState } from 'react';

// We'll treat skills + projects as one combined navigation item.
const SECTION_IDS = ['home','about','skills','projects','experience','contact'];

export default function Header(){
    const [active, setActive] = useState('home');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, {
            // Trigger when 40% of a section is visible
            threshold: 0.4
        });

        SECTION_IDS.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
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