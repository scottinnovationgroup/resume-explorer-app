import { useState, useEffect, useRef } from 'react'

// Layers icon — represents multiple views/perspectives
function ViewsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 5l6-3 6 3-6 3-6-3z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M2 9l6 3 6-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12.5l6 3 6-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ViewToggle({ view, views, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const activeView = views.find(v => v.id === view)

  useEffect(() => {
    function onPointerDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function handleSelect(id) {
    onChange(id)
    setOpen(false)
  }

  return (
    <>
      {/* Desktop: inline pill buttons */}
      <div className="view-toggle view-toggle--desktop">
        {views.map(v => (
          <button
            key={v.id}
            className={`toggle-btn${view === v.id ? ' active' : ''}`}
            onClick={() => onChange(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Mobile: icon trigger + dropdown */}
      <div className="view-toggle view-toggle--mobile" ref={ref}>
        <button
          className={`view-toggle-trigger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select view"
        >
          <ViewsIcon />
          <span className="view-toggle-current">{activeView?.label}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d={open ? 'M2 6l3-3 3 3' : 'M2 4l3 3 3-3'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <ul className="view-toggle-dropdown" role="listbox">
            {views.map(v => (
              <li key={v.id} role="option" aria-selected={view === v.id}>
                <button
                  className={`view-toggle-option${view === v.id ? ' active' : ''}`}
                  onClick={() => handleSelect(v.id)}
                >
                  {v.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
