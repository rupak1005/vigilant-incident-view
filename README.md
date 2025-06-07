#  AI Safety Incident Dashboard
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-EF008F?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

A fully featured, performant, and responsive AI Safety Incident Dashboard built using **React + TypeScript**. This project showcases modern UI/UX patterns, persistent state management, CSV export, rich animations with Framer Motion, and data visualizations powered by Recharts.
[![Netlify Status](https://api.netlify.com/api/v1/badges/db718536-cb6a-44c1-b38c-f6c5396a4c4c/deploy-status)](https://app.netlify.com/sites/rupak-s/deploys)

 **Live Demo**: [https://incidentview.netlify.app](https://incidentview.netlify.app)

---

## Screenshots


![image](https://github.com/user-attachments/assets/583628b1-d77b-4b2a-a616-9ab8577e5c54)
![image](https://github.com/user-attachments/assets/d8ef574b-99d1-45ca-8515-ebdc42626ce9)

##  Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [UI/UX Design Principles](#uiux-design-principles)
- [Performance Optimizations](#performance-optimizations)
- [LocalStorage Strategy](#localstorage-strategy)
- [CSV Export Internals](#csv-export-internals)
- [AI Summary Simulation](#ai-summary-simulation)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

| Category         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| UI            | Glassmorphism cards, dark/light mode, animated transitions, responsive layout |
| Filtering     | Full-text search with match-highlighting, date range and multi-select severity filters |
| Visualizations| Trend chart (Bar), severity distribution (Pie), dynamic and theme-aware       |
| Persistence   | Theme, incidents, and filters persisted via localStorage                      |
| Data Export   | Export filtered incidents to CSV using PapaParse                              |
| AI Summary    | Mocked GPT-style summary generator (placeholder for future LLM integration)  |
| Interaction   | In-place editing, confirmation dialogs, bulk delete, real-time toast feedback |

---

## Architecture

**Component-Based Hierarchy:**
```
<App />
 ├── ThemeProvider
 ├── ToastProvider
 ├── IncidentForm
 ├── IncidentFilters
 ├── IncidentList
 │    ├── IncidentCard (Expandable)
 ├── Charts (Trend, Severity)
 └── ExportCSVButton
```

- **Separation of Concerns:** Reusable, testable components (forms, filters, charts, etc.)
- **State Lifting:** `App.tsx` orchestrates state: incidents, filters, and theme
- **Custom Hooks:** `useLocalStorage` abstracts state persistence logic

---

## Tech Stack

| Tech                | Purpose                                               |
|---------------------|-------------------------------------------------------|
| React (w/ Vite)     | SPA scaffolding and rendering                        |
| TypeScript          | Type safety across components                        |
| Tailwind CSS        | Atomic and responsive theming                        |
| Framer Motion       | Advanced animations                                  |
| Recharts            | Declarative charts for incident data                |
| React Hot Toast     | Toast notifications                                  |
| PapaParse           | CSV serialization and download                       |
| date-fns            | Lightweight date utilities                           |

---

## UI/UX Design Principles

- **Glassmorphism:**
  - `backdrop-blur-md`, `bg-opacity-30`, `ring-1 ring-white/10`
  - Applied to cards and forms for frosted glass feel

- **Dark Mode Support:**
  - LocalStorage-persisted toggle via `useLocalStorage`
  - Tailwind's `dark:` variants for styling
  - Charts dynamically themed using `useDarkMode()`

- **Framer Motion Animations:**
  - Hover effects and spring-based scaling
  - Smooth expand/collapse of cards with `AnimatePresence`
  - Mount fade-ins for headers/forms

- **Accessibility:**
  - Semantic HTML: `<article>`, `<form>`, `<section>`
  - `aria-label` and `role="dialog"` for modals
  - Keyboard support planned

---

## Performance Optimizations

- **Memoization:**
  - Components like Charts, IncidentList memoized to reduce re-renders

- **Stable Keys:**
  - UUIDs used for consistent React rendering

- **Efficient Filtering:**
  - In-memory array chaining for filters
  - Debounced search (planned for larger datasets)

---

## LocalStorage Strategy

Custom Hook:
```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T) => void]
```

**Persists:**
- `incidentData`
- `themeMode`
- `filters` (planned)

Synced on mount using `useEffect`

---

## CSV Export Internals

- **Dynamic Export:**
  - Exports only currently visible incidents from filtered list

- **PapaParse:**
  - Converts data → CSV Blob
  - Triggers browser download via `<a>` tag + data URI

---

## AI Summary Simulation

- Click "Generate Summary" → triggers `setTimeout`
- Toast or collapsible paragraph shows mocked summary
- Placeholder for LLM APIs (OpenAI, Claude, etc.)

---

## Setup Instructions

1. **Clone Repository**
```bash
git clone https://github.com/rupak1005/vigilant-incident-view.git
cd incident-dashboard
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Dev Server**
```bash
npm run dev
```
Access via: `http://localhost:5173`

4. **Build for Production**
```bash
npm run build
npm run preview
```

---

## Folder Structure
```
incident-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── IncidentCard.tsx
│   │   ├── IncidentForm.tsx
│   │   ├── IncidentFilters.tsx
│   │   ├── Charts.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ExportCSVButton.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── utils/
│   │   ├── csvExport.ts
│   │   ├── filterUtils.ts
│   │   └── dateUtils.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Future Enhancements

- LLM Integration (OpenAI, Claude) for real-time summaries
- Export to PDF (via html2canvas + jsPDF)
- Touch gestures for mobile users
- Unit & E2E Testing (Jest + Cypress)
- Role-based access and authentication
- Backend support via Firebase/Supabase/PostgreSQL

---

## License

**MIT License © 2025 Rupak Kumar**


