import { useEffect, useState } from "react";

const SECTION_IDS = ["home", "about", "skills", "projects", "experience", "contact"];

export default function Header() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const focusY = window.scrollY + window.innerHeight * 0.4;
        let bestId = "home";
        let bestDist = Infinity;

        for (const element of elements) {
          const rect = element.getBoundingClientRect();
          const center = window.scrollY + rect.top + rect.height / 2;
          const distance = Math.abs(center - focusY);
          if (distance < bestDist) {
            bestDist = distance;
            bestId = element.id;
          }
        }

        setActive((prev) => (prev === bestId ? prev : bestId));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const stackActive = active === "skills" || active === "projects";
  const handleNavClick = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className={`navDiv ${menuOpen ? "nav-open" : ""}`}>
      <div className="nav-brand-row">
        <a href="#home" className="brand">
          Kian Aaron Bungao
        </a>
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
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <a href="#home" className={active === "home" ? "active-nav" : ""} onClick={handleNavClick}>
            Home
          </a>
        </li>
        <li>
          <a href="#about" className={active === "about" ? "active-nav" : ""} onClick={handleNavClick}>
            About
          </a>
        </li>
        <li>
          <a href="#skills" className={stackActive ? "active-nav" : ""} onClick={handleNavClick}>
            Stack
          </a>
        </li>
        <li>
          <a href="#experience" className={active === "experience" ? "active-nav" : ""} onClick={handleNavClick}>
            Experience
          </a>
        </li>
        <li>
          <a href="#contact" className={active === "contact" ? "active-nav" : ""} onClick={handleNavClick}>
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}
