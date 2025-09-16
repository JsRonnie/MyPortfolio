export default function AboutMeAndCapabilities() {
  return (
    <div id="about" style={{ background: "#111", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <section style={{ display: "flex", flexDirection: 'column', gap: '1.5rem', padding: "4rem 2rem 0 2rem", maxWidth: '1100px', margin: '0 auto' }}>
        <h2 className="sectionTitle" style={{ fontSize: "2.5rem", fontWeight: "bold", letterSpacing: "2px", margin: 0 }}>ABOUT ME</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "500", marginBottom: "1rem" }}>
            I’m a student from the Philippines learning front-end development, currently focused on React and building accessible websites.
          </h2>
          <p style={{ marginBottom: "2rem", color: "#ccc" }}>
           As a student, I’m currently focused on learning both front-end and back-end development. I’m eager to keep building my skills, exploring new technologies, and growing into a well-rounded developer.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button style={{
              background: "#d6f26a",
              color: "#222",
              border: "none",
              borderRadius: "1.5rem",
              padding: "0.75rem 2rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}>
              DOWNLOAD RESUME
            </button>
            <span style={{
              background: "#111",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem"
            }}>
              {/* Simple GitHub SVG icon */}
              <svg height="22" width="22" viewBox="0 0 16 16" fill="#d6f26a" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}