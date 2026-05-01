import { useState } from 'react'
import ViewToggle from './components/ViewToggle'
import ResumeView from './components/ResumeView'
import SectionNav from './components/SectionNav'
import { exportToPdf } from './utils/exportPdf'

// ─── Config resolution ─────────────────────────────────────────────────────────
// Vite resolves this glob at build time — only files that actually exist are included.
const configs = import.meta.glob(['./config.js', './sample.config.js'], { eager: true })

let resumeData = null
let configOptions = {}
let configStatus = 'missing' // 'ok' | 'fallback' | 'missing'

if ('./config.js' in configs) {
  resumeData = configs['./config.js'].default
  configOptions = configs['./config.js'].options ?? {}
  configStatus = 'ok'
} else if ('./sample.config.js' in configs) {
  resumeData = configs['./sample.config.js'].default
  configOptions = configs['./sample.config.js'].options ?? {}
  configStatus = 'fallback'
}

const { showBrandIcon = true, showBrandTitle = true, brandIcon = null } = configOptions
const showAnything = showBrandIcon || showBrandTitle

// ─── Page title ────────────────────────────────────────────────────────────────
document.title = [
  resumeData?.person?.name,
  resumeData?.person?.headline,
  'Resume Explorer',
].filter(Boolean).join(' – ')

// ─── Config banner ─────────────────────────────────────────────────────────────
function ConfigBanner() {
  if (configStatus === 'ok') return null

  if (configStatus === 'missing') {
    return (
      <div className="config-banner config-banner--error">
        No config file found. Add <code>src/config.js</code> or restore <code>src/sample.config.js</code>.
      </div>
    )
  }

  return (
    <div className="config-banner config-banner--warning">
      Using sample data. Copy <code>sample.config.js</code> → <code>config.js</code> and point it at your own data file to get started.
    </div>
  )
}

// ─── Views ─────────────────────────────────────────────────────────────────────
const VIEWS = [
  { id: 'compact',  label: 'Compact'  },
  { id: 'expanded', label: 'Expanded' },
  { id: 'detailed', label: 'Detailed' },
]

const VALID_VIEWS = new Set(VIEWS.map(v => v.id))

function getInitialView() {
  const param = new URLSearchParams(window.location.search).get('view')
  return VALID_VIEWS.has(param) ? param : 'compact'
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState(getInitialView)
  const [exporting, setExporting] = useState(false)

  function handleViewChange(v) {
    setView(v)
    const url = new URL(window.location)
    url.searchParams.set('view', v)
    window.history.replaceState(null, '', url)
  }

  async function handleExportPdf() {
    if (exporting) return
    setExporting(true)
    try {
      await exportToPdf(resumeData, view, {
        personName: resumeData?.person?.name,
      })
    } finally {
      setExporting(false)
    }
  }

  if (configStatus === 'missing') {
    return (
      <div className="app">
        <ConfigBanner />
      </div>
    )
  }

  return (
    <div className="app">
      <SectionNav view={view} data={resumeData} />
      <ConfigBanner />
      <div className="app-toolbar">
        <div className="toolbar-inner">
          <div className="toolbar-brand">
            {(showBrandIcon || showBrandTitle) && (
              <span className="toolbar-brand-title">
                {showBrandIcon && (
                  brandIcon
                    ? <img src={brandIcon} alt="" aria-hidden="true" className="toolbar-brand-icon" />
                    : (
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 1h7l4 4v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                        <path d="M10 1v4h4" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                        <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                        <line x1="4" y1="10.5" x2="10" y2="10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                        <circle cx="11.5" cy="12.5" r="1.75" stroke="currentColor" strokeWidth="1.25"/>
                        <line x1="12.8" y1="13.8" x2="14.5" y2="15.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                      </svg>
                    )
                )}
                {showBrandTitle && <span className="toolbar-label">Resume Explorer</span>}
              </span>
            )}
            {resumeData.person?.name && (
              <>
                {showAnything && <span className="toolbar-brand-sep" />}
                <span className="toolbar-person-name">{resumeData.person.name}</span>
              </>
            )}
          </div>
          <div className="toolbar-actions">
            <ViewToggle view={view} views={VIEWS} onChange={handleViewChange} />
            <div className="toolbar-divider" />
            <button
              className={`export-link${exporting ? ' exporting' : ''}`}
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? (
                <span className="export-spinner" aria-hidden="true" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              PDF
            </button>
          </div>
        </div>
      </div>
      <main className="app-main">
        <ResumeView data={resumeData} view={view} />
      </main>
      <footer className="app-footer">
        <span className="footer-name">Resume Explorer</span>
        <span className="footer-sep">·</span>
        <span className="footer-credit">Built by Brandon Scott</span>
        <a
          href="https://github.com/scottinnovationgroup/resume-explorer-app"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github"
          aria-label="GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
      </footer>
    </div>
  )
}
