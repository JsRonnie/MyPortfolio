import { FaLinkedinIn } from "react-icons/fa";
import { HiArrowDownRight } from "react-icons/hi2";
import DailyQuote from "./DailyQuote";

const assetMap = import.meta.glob("../assets/*", { eager: true, query: "?url", import: "default" });
const photo = assetMap["../assets/newpicture.jpg"] ?? assetMap["../assets/mrRonnie.jpg"];

export default function Herosec() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <main className="hero-text">
          <p className="hero-kicker">Aspiring software developer building across front-end and back-end</p>
          <h1 className="name sectionTitle hero-title">
            KIAN AARON
            <br />
            BUNGAO
          </h1>
          <p className="hero-subtitle">
            Aspiring software developer from the Philippines with hands-on experience in React, ASP.NET Core, C#,
            and relational databases. I enjoy building responsive, user-friendly interfaces and also have practical
            experience developing REST APIs, implementing authentication, and working with structured data on the backend.
          </p>
          <div className="hero-stats" aria-label="Quick profile highlights">
            <div className="hero-stat-card">
              <span className="hero-stat-value">2026</span>
              <span className="hero-stat-label">BSIT expected graduation</span>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-value">1.46</span>
              <span className="hero-stat-label">Dean&apos;s Lister GWA</span>
            </div>
            <div className="hero-stat-card">
              <span className="hero-stat-value">API + UI</span>
              <span className="hero-stat-label">Full-stack project delivery</span>
            </div>
          </div>
          <div className="hero-cta">
            <a href="#projects" className="primary-btn">
              View Projects <HiArrowDownRight size={18} />
            </a>
            <a href="#contact" className="secondary-btn">
              Contact Me
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Open LinkedIn profile"
              aria-label="Open LinkedIn profile"
              className="icon-btn"
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
          <div className="hero-quote">
            <DailyQuote />
          </div>
        </main>
        <article className="hero-photo">
          <div className="hero-photo-frame">
            <div className="hero-photo-meta">
              <span>Backend Developer Intern</span>
              <span>ASP.NET Core / C# / MySQL</span>
            </div>
            <img src={photo} alt="Kian Aaron Bungao profile" width="320" height="320" />
          </div>
        </article>
      </div>
    </section>
  );
}
