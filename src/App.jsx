import { useState } from 'react'
import resumeData from '../resume_explorer_model.json'
import ViewToggle from './components/ViewToggle'
import ResumeView from './components/ResumeView'
import { exportToPdf } from './utils/exportPdf'

const VIEWS = [
  { id: 'compact', label: 'Compact' },
  { id: 'detailed', label: 'Detailed' },
]

export default function App() {
  const [view, setView] = useState('compact')
  const [exporting, setExporting] = useState(false)

  async function handleExportPdf() {
    if (exporting) return
    setExporting(true)
    try {
      await exportToPdf(resumeData, view, {
        personName: resumeData.person.name,
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app">
      <div className="app-toolbar">
        <div className="toolbar-inner">
          <span className="toolbar-label">Resume Explorer</span>
          <div className="toolbar-actions">
            <ViewToggle view={view} views={VIEWS} onChange={setView} />
            <button
              className={`export-btn${exporting ? ' exporting' : ''}`}
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="export-spinner" aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 1v9M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <main className="app-main">
        <ResumeView data={resumeData} view={view} />
      </main>
    </div>
  )
}
