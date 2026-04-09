import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";

const DEFAULT_PROJECT_IMAGE = "https://placehold.co/600x400/1b1b1b/FFFFFF?text=Project";

export default function Projects({
  title = "SELECTED WORK",
  subtitle = "Projects and practical experience that reflect both system logic and product-facing implementation.",
  projects = []
}) {
  const placeholders = [
    { id: "ph1", name: "Coming Soon", description: "", tech: [], badge: "" },
    { id: "ph2", name: "Coming Soon", description: "", tech: [], badge: "" },
    { id: "ph3", name: "Coming Soon", description: "", tech: [], badge: "" }
  ];
  const list = projects?.length > 0 ? projects.slice(0, 3) : placeholders;

  return (
    <section id="projects" className="projects-section">
      <div className="projects-shell">
        <div className="projects-heading">
          <p className="section-eyebrow">Projects</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="projects-grid"
        >
          {list.map((project) => {
            const isPlaceholder = project.name === "Coming Soon";
            const preview = project.imageUrl || DEFAULT_PROJECT_IMAGE;

            return (
              <motion.article key={project.id} className="project-card" whileHover={{ y: -8 }}>
                {project.badge && !isPlaceholder && <span className="project-badge">{project.badge}</span>}
                {!isPlaceholder && (
                  <div className="project-image-wrap">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-image-link">
                        <img src={preview} alt={project.name} className="project-image" />
                      </a>
                    ) : (
                      <img src={preview} alt={project.name} className="project-image" />
                    )}
                  </div>
                )}
                <div className="project-copy">
                  <h3>{project.name}</h3>
                  {!isPlaceholder && <p>{project.description}</p>}
                </div>
                {!isPlaceholder && project.tech?.length > 0 && (
                  <div className="project-tech-list">
                    {project.tech.slice(0, 6).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                )}
                {project.link && !isPlaceholder && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    Visit Project <HiArrowUpRight size={16} />
                  </a>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
