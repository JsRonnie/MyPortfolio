import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { HiArrowDownRight } from "react-icons/hi2";
import { WEB3FORM_ACCESS_KEY, WEB3FORM_NOTIFICATION_EMAIL } from "../lib/web3formConfig";

const initialForm = { name: "", email: "", subject: "", message: "" };
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_SCRIPT_SRC = "https://web3forms.com/client/script.js";

const timeline = [
  {
    role: "Backend Developer Intern",
    company: "Xentra Infotech Solutions Inc",
    date: "January 2026 - April 2026",
    summary:
      "Worked on an ASP.NET Core Web API backend focused on data operations, JWT-based authentication and authorization, parameterized SQL queries, global exception handling, logging, and email-service integration."
  },
  {
    role: "Capstone Full-Stack Developer",
    company: "Dog Match Platform",
    date: "2025 - 2026",
    summary:
      "Built system logic for trait-based matching and worked on authentication, role-based access, messaging, discussions, and PostgreSQL-backed data structure using React and Supabase."
  }
];

export default function ExperienceAndContact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const formRef = useRef(null);
  const captchaRef = useRef(null);
  const captchaIdRef = useRef(null);
  const [isCaptchaReady, setCaptchaReady] = useState(false);
  const contactEmail = (WEB3FORM_NOTIFICATION_EMAIL || "kianaaron.bungao@gmail.com").trim();
  const contactEmailHref = contactEmail ? `mailto:${contactEmail}` : "#";

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    function markReady() {
      setCaptchaReady(true);
    }

    let script = document.querySelector(`script[src="${WEB3FORMS_SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = WEB3FORMS_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.dataset.web3forms = "true";
      script.addEventListener("load", markReady);
      document.body.appendChild(script);
    } else if (window.hcaptcha) {
      setCaptchaReady(true);
    } else {
      script.addEventListener("load", markReady);
    }

    return () => {
      script?.removeEventListener("load", markReady);
    };
  }, []);

  useEffect(() => {
    if (!isCaptchaReady || typeof window === "undefined" || !window.hcaptcha || !captchaRef.current) return;
    try {
      if (captchaIdRef.current !== null) {
        window.hcaptcha.reset(captchaIdRef.current);
        return;
      }
      captchaIdRef.current = window.hcaptcha.render(captchaRef.current, { theme: "dark" });
    } catch (err) {
      console.error("Failed to render hCaptcha", err);
    }
  }, [isCaptchaReady]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ state: "error", message: "Name, email, and message are required." });
      return;
    }
    const captchaField = formRef.current?.querySelector('textarea[name="h-captcha-response"]');
    const captchaResponse = captchaField?.value?.trim() || "";
    if (!captchaResponse) {
      setStatus({ state: "error", message: "Please complete the captcha before submitting." });
      return;
    }

    setStatus({ state: "loading", message: "Sending..." });
    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORM_ACCESS_KEY);
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("subject", form.subject.trim());
      formData.append("message", form.message.trim());
      formData.append("h-captcha-response", captchaResponse);

      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setStatus({ state: "success", message: "Message received! I will get back to you soon." });
        setForm(initialForm);
      } else {
        setStatus({ state: "error", message: data.message || "Something went wrong. Please try again." });
      }
    } catch (error) {
      setStatus({ state: "error", message: "Unable to reach Web3Forms. Please try again later." });
    }
  };

  return (
    <div id="experience" className="experience-contact-shell">
      <section className="experience-section">
        <div className="experience-heading">
          <p className="section-eyebrow">Experience</p>
          <h2 className="sectionTitle">Recent work centered on APIs, security, and reliable data handling.</h2>
        </div>

        <div className="experience-grid">
          <div className="timeline-list">
            {timeline.map((item) => (
              <article key={`${item.role}-${item.company}`} className="timeline-card">
                <p className="timeline-date">{item.date}</p>
                <h3>{item.role}</h3>
                <span>{item.company}</span>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>

          <aside className="experience-summary-card">
            <p className="summary-label">What I bring</p>
            <ul>
              <li>Hands-on ASP.NET Core Web API development</li>
              <li>JWT authentication and authorization</li>
              <li>MySQL, PostgreSQL, and SQL Server familiarity</li>
              <li>Responsive React interfaces for complete delivery</li>
            </ul>
          </aside>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-copy">
          <p className="section-eyebrow">Contact</p>
          <h2 className="sectionTitle">Let&apos;s build something useful.</h2>
          <p>
            I&apos;m actively growing as a software developer and looking for opportunities where I can contribute across
            backend logic, API development, and polished front-end experiences.
          </p>

          <div className="contact-points">
            <a href={contactEmailHref}>
              <FaEnvelope size={16} />
              {contactEmail}
            </a>
            <span>
              <FaMapMarkerAlt size={16} />
              Philippines
            </span>
          </div>

          <div className="contact-note">
            <HiArrowDownRight size={18} />
            <span>Open to backend, web application, and software developer roles.</span>
          </div>
        </div>

        <div className="contact-form-card">
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
            <input type="hidden" name="access_key" value={WEB3FORM_ACCESS_KEY} />

            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>

            <label>
              Subject
              <input type="text" name="subject" value={form.subject} onChange={handleChange} />
            </label>

            <label>
              Message
              <textarea rows={5} name="message" value={form.message} onChange={handleChange} required />
            </label>

            <div ref={captchaRef} className="h-captcha" data-captcha="true" data-theme="dark" />

            <button type="submit" className="contact-submit-btn" disabled={status.state === "loading"}>
              {status.state === "loading" ? "SENDING..." : "SEND MESSAGE"}
            </button>

            {status.state !== "idle" && (
              <p className={`contact-status ${status.state === "error" ? "is-error" : "is-success"}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
