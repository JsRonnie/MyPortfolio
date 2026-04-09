const capabilityCards = [
  {
    title: "Backend Development",
    body: "Builds ASP.NET Core Web APIs with layered structure, secure authentication flows, and maintainable endpoint design."
  },
  {
    title: "Data & Integration",
    body: "Works with MySQL, PostgreSQL, SQL Server, and service integrations while keeping queries structured and reliable."
  },
  {
    title: "Frontend Delivery",
    body: "Creates responsive React interfaces that support real product features instead of stopping at static layouts."
  }
];

export default function AboutMeAndCapabilities() {
  return (
    <section id="about" className="about-section">
      <div className="about-shell">
        <div className="about-copy">
          <p className="section-eyebrow">About Me</p>
          <h2 className="sectionTitle about-title">Building stronger backend systems while keeping the interface clean.</h2>
          <p className="about-lead">
            I&apos;m an aspiring software developer and BSIT student at La Consolacion University Philippines, expected to
            graduate in June 2026. My recent work has centered on backend development with ASP.NET Core and C#, where
            I focused on authentication, authorization, API design, error handling, and logging.
          </p>
          <p className="about-copy-text">
            I also enjoy front-end work because it helps me ship complete solutions. That mix lets me understand both
            the user experience and the system logic behind it, whether I&apos;m building a React interface, defining
            RESTful endpoints, or structuring database interactions.
          </p>
          <div className="about-highlights" aria-label="Education and certifications">
            <span>Bachelor of Science in Information Technology</span>
            <span>Expected June 2026</span>
            <span>Microsoft Office Specialist: Access Expert</span>
            <span>Device Configuration and Management (Windows 11)</span>
          </div>
        </div>
        <div className="about-grid">
          {capabilityCards.map((card) => (
            <article key={card.title} className="about-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
