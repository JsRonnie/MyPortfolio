// Prefer newpicture.jpg when available; fall back to mrRonnie.jpg
// Vite will replace these with asset URLs at build time
// Use new Vite options: query + import to fetch the url string
const assetMap = import.meta.glob('../assets/*', { eager: true, query: '?url', import: 'default' });
const photo = assetMap['../assets/newpicture.jpg'] ?? assetMap['../assets/mrRonnie.jpg'];
import DailyQuote from './DailyQuote';

export default function Herosec() {
  return (
    <section
      id="home"
      className="mainSec"
      style={{
        background: "#111",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        padding: "3rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5rem",
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
      <main
        className="mainbody"
        style={{
          flex: "0 0 520px",
          maxWidth: "520px",
        }}
      >
        <h1
          className="name sectionTitle"
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            letterSpacing: "2px",
            marginBottom: "1rem",
            lineHeight: "1.1",
          }}
        >
          HI, I AM<br />
          KIAN AARON<br />
          BUNGAO.
        </h1>
        <p
          style={{
            marginBottom: "2rem",
            color: "#ccc",
            maxWidth: "420px",
            fontSize: "1rem",
            lineHeight: "1.5",
          }}
        >
          I’m a Philippines-based front-end developer passionate about building accessible and user-friendly websites. I love creating responsive designs that work across devices and believe the web should be welcoming and usable for everyone.
        </p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            style={{
              background: "#d6f26a",
              color: "#222",
              border: "none",
              borderRadius: "1.5rem",
              padding: "0.75rem 2rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            CONTACT ME
          </button>
          <a
            href="https://github.com/JsRonnie/MyPortfolio"
            target="_blank"
            rel="noopener noreferrer"
            title="Open GitHub repository"
            aria-label="Open GitHub repository"
            style={{
              background: "#222",
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              textDecoration: "none",
            }}
          >
            {/* GitHub SVG icon */}
            <svg height="22" width="22" viewBox="0 0 16 16" fill="#d6f26a" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </div>
        
        {/* Daily quote box */}
        <div style={{ marginTop: '1.25rem' }}>
          <DailyQuote />
        </div>
      </main>
      <article
        className="mrPhoto"
        style={{
          flex: "0 0 360px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg,#1b1b1b,#121212)",
            border: "1px solid #222",
            borderRadius: "18px",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100px",
            minHeight: "100px",
            boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
          }}
        >
          <img
            src={photo}
            alt="Profile"
            width="320"
            height="320"
            style={{
              borderRadius: "14px",
              objectFit: "cover",
              aspectRatio: "1 / 1",
              boxShadow: "0 10px 24px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </article>
      </div>
    </section>
  );
}