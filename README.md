# Resume Explorer

Resume Explorer is an interactive, self-hosted resume you can deploy to the web and share with anyone — recruiters, hiring managers, or anyone reviewing your background. Instead of sending a static PDF or linking to a generic profile, you give people a live URL that presents your experience in a clean, navigable format they can actually explore.

Content is driven entirely by a JSON data file you control. Update your data, redeploy, and your shared link reflects the changes instantly. A PDF export is always one click away for anyone who needs a traditional copy.

---

## Why Resume Explorer

Most resumes are built for one audience and one format. Resume Explorer lets you host your full professional story and give viewers the ability to browse it at whatever depth they need — a quick scan, a structured read, or a deep dive into projects and contributions. The link you share is the resume.

---

## Features

- **Three views** — Compact (role summaries only), Expanded (summaries with achievements and contributions), and Detailed (full content: projects, skills, and side projects)
- **Shareable URLs** — each view has a unique, bookmarkable URL (`?view=compact`) that loads exactly as shared
- **Section navigator** — collapsible side panel with two-level navigation and scroll-based active tracking, so viewers can jump to any part of your resume instantly
- **PDF export** — viewers can download a clean, paginated PDF at any time with one click
- **Data-driven** — all content lives in a single JSON file you own and maintain; nothing is hardcoded in the UI

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/resume-explorer-app.git
cd resume-explorer-app

# 2. Install dependencies
npm install

# 3. Set up your config file
cp src/sample.config.js src/config.js
```

### Configure Your Data

Open `src/config.js` and update the import to point at your own JSON data file:

```js
// src/config.js
import resumeData from './data/my-resume.json'  // ← point this at your file

export default resumeData
```

Your JSON file must follow the structure described in the [Data Model](#data-model) section below. See `src/data/sample.json` for a complete working example with fictitious data.

> **Note:** `src/config.js` is gitignored intentionally. It is your local entry point to your private resume data and should not be committed.

### Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

```bash
npm run build
npm run preview  # preview the production build locally
```

---

## Data Model

All resume content is defined in a single JSON file. Only the fields listed below are used by the application — any additional fields in your file will be ignored.

### `person`

| Field | Type | Description |
|---|---|---|
| `name` | string | Full name, displayed in the toolbar and resume header |
| `headline` | string | Professional headline shown below the name |
| `location.display` | string | City/state or region (e.g. `"Austin, TX"`) |
| `contact.email` | string | Email address |
| `contact.phone` | string | Phone number |
| `links[].type` | string | Link type — `"linkedin"` renders in the header; others are stored but not currently displayed |
| `links[].url` | string | Full URL |

### `roles[]`

| Field | Type | Description |
|---|---|---|
| `role_id` | string | Unique identifier |
| `title` | string | Job title |
| `company` | string | Employer name |
| `start_date` | string | Start date in `YYYY-MM` format |
| `end_date` | string \| null | End date in `YYYY-MM` format; `null` if current |
| `current_role` | boolean | Set to `true` to show "Present" as the end date |
| `location` | string | Work location |
| `role_summary` | string | Short paragraph shown in all views |
| `management_scope.team_size_direct_reports` | number | Number of direct reports *(detailed view)* |
| `management_scope.team_size_supported_or_mentored` | number | Broader team size *(detailed view)* |
| `contract_context.client` | string | Client name *(detailed view)* |
| `contract_context.contract_value` | number | Contract value in USD *(detailed view)* |
| `contract_context.period_of_performance` | string | Duration description *(detailed view)* |
| `delivery_scope.portfolio_projects_tracked` | number | Number of projects tracked *(detailed view)* |
| `delivery_scope.total_contract_value` | number | Total portfolio value in USD *(detailed view)* |
| `delivery_scope.customer_accounts[]` | string[] | List of customer account names *(detailed view)* |
| `primary_themes[]` | string[] | Tags shown as chips *(detailed view)* |

> Roles with the same `company` value are automatically grouped with a visual left border.

### `resume_points[]`

Bullet points associated with a role. Only items with `status: "approved"` are displayed.

| Field | Type | Description |
|---|---|---|
| `bullet_id` | string | Unique identifier |
| `role_id` | string | References a `role_id` |
| `bullet_type` | string | Groups bullets under a label. Supported values: `"achievement"`, `"leadership"`, `"founder_project"` |
| `bullet_text` | string | The bullet content |
| `status` | string | Only `"approved"` items render |

> Bullets are grouped by `bullet_type` (alphabetically) and displayed in the **Expanded** and **Detailed** views only.

### `projects[]`

Key projects shown in the **Detailed** view, grouped by associated role.

| Field | Type | Description |
|---|---|---|
| `project_id` | string | Unique identifier |
| `project_name` | string | Project title |
| `project_type` | string | Category label (e.g. `"Platform"`, `"Data Engineering"`) |
| `role_ids[]` | string[] | Associated role IDs — the first entry determines grouping |
| `summary` | string | Short description paragraph |
| `metrics[].metric_name` | string | Metric label |
| `metrics[].metric_value` | number | Metric value — large numbers are abbreviated (K/M) |
| `metrics[].metric_unit` | string | Unit type. Supported: `"percent"`, `"USD"`, `"count"`, `"hours"`, `"days"`, `"weeks"`, `"months"`, `"years"`, and other time units |
| `outcomes[]` | string[] | Bullet outcomes |
| `technologies[]` | string[] | Tech tags |

### `skills_catalog[]`

Shown in the **Detailed** view, grouped by category.

| Field | Type | Description |
|---|---|---|
| `skill_name` | string | Skill label |
| `skill_category` | string | Category used for grouping (e.g. `"Languages"`, `"Cloud & DevOps"`) |

### `education[]`

Shown in all views.

| Field | Type | Description |
|---|---|---|
| `education_id` | string | Unique identifier |
| `degree` | string | Full degree name (e.g. `"Bachelor of Science"`) |
| `degree_abbreviation` | string | Abbreviation shown in parentheses (e.g. `"B.S."`) |
| `institution` | string | School name |
| `location` | string | City/state |
| `field_of_study` | string | Major or concentration |

### `certifications[]`

Shown in all views.

| Field | Type | Description |
|---|---|---|
| `certification_id` | string | Unique identifier |
| `certification_name` | string | Full certification name |
| `certification_abbreviation` | string | Short form shown in parentheses |
| `issuing_organization` | string | Issuing body |
| `credential_id` | string | Credential or license number |

### `independent_projects[]`

Side projects shown in the **Detailed** view.

| Field | Type | Description |
|---|---|---|
| `independent_project_id` | string | Unique identifier |
| `project_name` | string | Project title |
| `project_type` | string | Category label (e.g. `"SaaS"`, `"Developer Tool"`) |
| `summary` | string | Short description |
| `website` | string | URL — rendered as a clickable link |
| `target_users[]` | string[] | Intended audience |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) |
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | Plain CSS (no framework) |
| PDF Generation | [@react-pdf/renderer 4](https://react-pdf.org/) |
| Font | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

### Key implementation details

- **Views** are driven entirely by a `view` prop (`compact` | `expanded` | `detailed`) passed through the component tree — no global state library
- **PDF export** uses `@react-pdf/renderer` to compose a separate PDF document tree, with custom smart page-break logic that prevents section titles and role headers from being orphaned across pages
- **Section navigator** uses `IntersectionObserver` for sticky label detection and a custom eased scroll animation; active state is tracked via scroll position
- **Config resolution** uses Vite's `import.meta.glob` to detect whether `config.js` exists at build time and falls back to `sample.config.js` with a visible warning banner
- **Metric formatting** abbreviates large numbers (`1200000` → `1.2M`) and handles time units with short suffixes (`days` → `d`, `months` → `mo`)

---

## Project Structure

```
resume-explorer-app/
├── src/
│   ├── App.jsx                  # Root component, config resolution, view state
│   ├── config.js                # Your config (gitignored — create from sample)
│   ├── sample.config.js         # Fallback config, committed as reference
│   ├── index.css                # All styles
│   ├── data/
│   │   └── sample.json          # Complete sample data model with fictitious data
│   ├── components/
│   │   ├── ViewToggle.jsx       # Compact / Expanded / Detailed toggle
│   │   ├── SectionNav.jsx       # Collapsible side navigation panel
│   │   ├── ResumeView.jsx       # Main resume article, routes sections by view
│   │   ├── sections/
│   │   │   ├── ResumeHeader.jsx
│   │   │   ├── ExperienceSection.jsx
│   │   │   ├── ProjectsSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── EducationSection.jsx
│   │   │   ├── CertificationsSection.jsx
│   │   │   └── IndependentProjectsSection.jsx
│   │   └── pdf/
│   │       └── ResumePdf.jsx    # PDF document component (@react-pdf/renderer)
│   └── utils/
│       ├── exportPdf.js         # PDF generation and download trigger
│       └── format.js            # Date, money, and metric formatting helpers
└── index.html
```

---

## Version

| | |
|---|---|
| App Version | 1.0.0 |
| README Updated | April 29, 2026 |
