// Prefer newpicture.jpg when available; fall back to mrRonnie.jpg
// Vite will replace these with asset URLs at build time
// Use new Vite options: query + import to fetch the url string
const assetMap = import.meta.glob('../assets/*', { eager: true, query: '?url', import: 'default' });
const photo = assetMap['../assets/newpicture.jpg'] ?? assetMap['../assets/mrRonnie.jpg'];
import DailyQuote from './DailyQuote';

export default function Herosec() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <main className="hero-text">
          <h1 className="name sectionTitle hero-title">
            HI, I AM<br />
            KIAN AARON<br />
            BUNGAO.
          </h1>
          <p className="hero-subtitle">
            I’m a Philippines-based front-end developer passionate about building accessible and user-friendly websites. I love creating responsive designs that work across devices and believe the web should be welcoming and usable for everyone.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="primary-btn">Contact Me</a>
            <a
              href="https://github.com/JsRonnie/MyPortfolio"
              target="_blank"
              rel="noopener noreferrer"
              title="Open GitHub repository"
              aria-label="Open GitHub repository"
              className="icon-btn"
            >
              <svg height="22" width="22" viewBox="0 0 16 16" fill="#d6f26a" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>
          <div className="hero-quote">
            <DailyQuote />
          </div>
        </main>
        <article className="hero-photo">
          <div className="hero-photo-frame">
            <img
              src={photo}
              alt="Profile"
              width="320"
              height="320"
            />
          </div>
        </article>
      </div>
    </section>
  );
}