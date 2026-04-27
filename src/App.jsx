import { useState } from 'react'
import resumeData from '../resume_explorer_model.json'
import ViewToggle from './components/ViewToggle'
import ResumeView from './components/ResumeView'

const VIEWS = [
  { id: 'compact', label: 'Compact' },
  { id: 'detailed', label: 'Detailed' },
]

export default function App() {
  const [view, setView] = useState('compact')

  return (
    <div className="app">
      <div className="app-toolbar">
        <div className="toolbar-inner">
          <span className="toolbar-label">Resume Explorer</span>
          <ViewToggle view={view} views={VIEWS} onChange={setView} />
        </div>
      </div>
      <main className="app-main">
        <ResumeView data={resumeData} view={view} />
      </main>
    </div>
  )
}
