# Developer Portfolio (React + Vite)

Personal portfolio scaffolded with Vite and enhanced with animated skill icons and placeholder project cards.

## Features Added

- Animated Skills section using `framer-motion` and `react-icons`
- Reusable `Skills` and `Projects` components fed entirely by props (arrays are mapped)
- Three placeholder project cards (easy to replace with real data)
- Responsive hero + sections styling
- Light hover and enter animations (motion + CSS fallback)

## Getting Started

Install dependencies:

```
npm install
```

Run local dev server:

```
npm run dev
```

Build for production:

```
npm run build
```

Preview production build:

```
npm run preview
```

## Editing Skills

In `src/App.jsx` the `skills` array feeds the `<Skills />` component:

```js
const skills = [
  { label: "HTML", color: "#e44d26" },
  { label: "CSS", color: "#1572B6" },
  { label: "JAVASCRIPT", color: "#f7df1e" },
  // ...add more
];
```

Add or remove objects; label (case-insensitive) maps to an icon if defined in `iconMap` inside `Skills.jsx`.

## Editing Projects

In `src/App.jsx` modify the `projects` array:

```js
const projects = [
  {
    id: "p1",
    name: "Portfolio Redesign",
    description: "...",
    tech: ["React", "Framer Motion"],
    badge: "IN PROGRESS",
  },
  {
    id: "p2",
    name: "Study Tracker App",
    description: "...",
    tech: ["React"],
    badge: "PLANNED",
  },
  {
    id: "p3",
    name: "API Practice Sandbox",
    description: "...",
    tech: ["Fetch API"],
    badge: "IDEA",
  },
];
```

Fields:

- `id`: unique key
- `name`: project title
- `description`: short text
- `tech`: array of small tag labels
- `badge`: optional top-left label
- `link`: optional URL (adds VIEW link)

## Dependencies

Key libraries:

- `react`, `react-dom`
- `framer-motion` (entrance + hover animations)
- `react-icons` (skill/tool icons)

## Adding More Icons

Update the `iconMap` object in `src/components/Skills.jsx` with an import from `react-icons`.

## Accessibility Notes

- Semantic sections used where practical.
- Motion only triggers on enter (reduces continuous animation); consider a reduced motion media query for production.

## Roadmap Ideas

- Dark/light theme toggle
- Real project screenshots (replace placeholder data)
- Contact form backend (EmailJS / serverless)
- Global state or CMS-driven content

---

Generated and customized from a base Vite React template.
