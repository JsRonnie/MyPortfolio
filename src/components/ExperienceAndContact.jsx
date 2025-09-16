export default function ExperienceAndContact() {
  return (
    <div id="experience" style={{ background: "#111", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      {/* Experience Section */}
      <section style={{ display: "flex", flexDirection: 'column', gap: '2rem', padding: "4rem 2rem 2rem 2rem", maxWidth: '1100px', margin: '0 auto' }}>
        <h2 className="sectionTitle" style={{ fontSize: "3rem", fontWeight: "bold", letterSpacing: "2px", margin: 0 }}>MY EXPERIENCE</h2>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>Front-End Student / React Learner</span>
              <span style={{ color: "#ccc", fontSize: "0.95rem" }}>2025 — Present</span>
            </div>
            <p style={{ color: "#ccc", marginTop: "0.5rem" }}>
             Actively studying React and modern front-end development. Practicing by building small projects that focus on responsive layouts, accessibility, and clean code.
            </p>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>Student Project (Java)</span>
              <span style={{ color: "#ccc", fontSize: "0.85rem" }}>2023 — 2nd Year</span>
            </div>
            <p style={{ color: "#ccc", marginTop: "0.5rem" }}>
              Completed Java-based projects as part of coursework, applying object-oriented programming concepts and problem-solving techniques.
            </p>
          </div>
        </div>
      </section>
      <hr style={{ border: "none", borderTop: "1px solid #222", margin: "2rem auto", maxWidth: '1100px' }} />
      {/* Contact Section */}
      <section id="contact" style={{ display: "flex", flexDirection: 'column', gap: '1.5rem', padding: "2rem 2rem 4rem 2rem", maxWidth: '1100px', margin: '0 auto' }}>
        <h2 className="sectionTitle" style={{ fontSize: "3rem", fontWeight: "bold", letterSpacing: "2px", margin: 0 }}>LET’S CONNECT</h2>
          <p style={{ margin: "0.5rem 0 0.5rem 0", color: "#ccc" }}>
            Say hello at <a href="mailto:kian.bungao@gmail.com" style={{ color: "#fff", textDecoration: "underline" }}>kian.bungao@gmail.com</a>
          </p>
          <p style={{ color: "#ccc", marginBottom: "1.5rem" }}>
            For more info, here's my <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>resume</a>
          </p>
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}>
            {/* GitHub */}
            <a href="#" aria-label="GitHub">
              <svg width="24" height="24" fill="#d6f26a" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            </a>
            {/* X (Twitter) */}
            <a href="#" aria-label="X">
              <svg width="24" height="24" fill="#d6f26a" viewBox="0 0 24 24"><path d="M17.53 7.477h3.468l-7.59 9.048 1.07 1.475h-3.468l-7.59-9.048 1.07-1.475h3.468l7.59 9.048-1.07 1.475z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg width="24" height="24" fill="#d6f26a" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.276.06-2.687.334-3.662 1.309-.975.975-1.249 2.386-1.309 3.662-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.276.334 2.687 1.309 3.662.975.975 2.386 1.249 3.662 1.309 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.276-.06 2.687-.334 3.662-1.309.975-.975 1.249-2.386 1.309-3.662.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.276-.334-2.687-1.309-3.662-.975-.975-2.386-1.249-3.662-1.309-1.28-.06-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
            </a>
          </div>
        <div>
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}>
            <label>
              Name
              <input type="text" style={{
                width: "100%",
                padding: "0.75rem",
                background: "#222",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                marginTop: "0.25rem"
              }} />
            </label>
            <label>
              Email
              <input type="email" style={{
                width: "100%",
                padding: "0.75rem",
                background: "#222",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                marginTop: "0.25rem"
              }} />
            </label>
            <label>
              Subject
              <input type="text" style={{
                width: "100%",
                padding: "0.75rem",
                background: "#222",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                marginTop: "0.25rem"
              }} />
            </label>
            <label>
              Message
              <textarea rows={5} style={{
                width: "100%",
                padding: "0.75rem",
                background: "#222",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                marginTop: "0.25rem"
              }} />
            </label>
            <button type="submit" style={{
              background: "#d6f26a",
              color: "#222",
              border: "none",
              borderRadius: "1.5rem",
              padding: "0.75rem 2rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1rem",
              alignSelf: "flex-start"
            }}>
              SUBMIT
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}