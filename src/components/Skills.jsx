import { motion } from "framer-motion";
import { FaCss3Alt, FaGitAlt, FaGithub, FaHtml5, FaReact } from "react-icons/fa";
import { HiOutlineCircleStack } from "react-icons/hi2";
import {
  SiDotnet,
  SiJavascript,
  SiMysql,
  SiPostgresql,
  SiPostman,
  SiSupabase,
  SiSwagger
} from "react-icons/si";
import { TbApi, TbBrandCSharp, TbDatabase, TbShieldLock, TbTool } from "react-icons/tb";

const iconMap = {
  "ASP.NET CORE WEB API": SiDotnet,
  "C#": TbBrandCSharp,
  "RESTFUL APIS": TbApi,
  "AUTHENTICATION & AUTHORIZATION": TbShieldLock,
  "ERROR HANDLING": TbApi,
  LOGGING: TbTool,
  "MICROSERVICES INTEGRATION": SiDotnet,
  MYSQL: SiMysql,
  POSTGRESQL: SiPostgresql,
  "SQL SERVER": HiOutlineCircleStack,
  SUPABASE: SiSupabase,
  POSTMAN: SiPostman,
  SWAGGER: SiSwagger,
  GIT: FaGitAlt,
  GITHUB: FaGithub,
  REACT: FaReact,
  JAVASCRIPT: SiJavascript,
  HTML: FaHtml5,
  CSS: FaCss3Alt
};

const categoryIconMap = {
  Backend: TbApi,
  Database: TbDatabase,
  Tools: TbTool,
  Frontend: FaReact,
  Concepts: TbShieldLock
};

const categoryOrder = ["Backend", "Database", "Concepts", "Tools", "Frontend"];

export default function Skills({
  title = "TECH STACK",
  subtitle = "A balanced toolkit built around backend development, data handling, API security, and responsive UI work.",
  skills = []
}) {
  const groupedSkills = categoryOrder
    .map((category) => ({
      category,
      items: skills.filter((skill) => skill.category === category)
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section id="skills" className="skills-section">
      <div className="skills-shell">
        <div className="skills-heading">
          <p className="section-eyebrow">Skills & Tools</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="skills-groups">
          {groupedSkills.map((group, index) => {
            const CategoryIcon = categoryIconMap[group.category] ?? TbApi;

            return (
              <motion.section
                key={group.category}
                className="skill-group"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <div className="skill-group-header">
                  <span className="skill-group-icon">
                    <CategoryIcon size={18} />
                  </span>
                  <div>
                    <h3>{group.category}</h3>
                    <p>{group.items.length} technologies</p>
                  </div>
                </div>

                <div className="skill-card-grid">
                  {group.items.map((skill) => {
                    const Icon = iconMap[skill.label] ?? FaGithub;

                    return (
                      <motion.article
                        key={skill.label}
                        className="skill-card"
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="skill-card-top">
                          <span className="skill-icon-wrap" style={{ color: skill.color }}>
                            <Icon size={24} />
                          </span>
                          <span className="skill-accent">{skill.accent}</span>
                        </div>
                        <h4>{skill.label}</h4>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
