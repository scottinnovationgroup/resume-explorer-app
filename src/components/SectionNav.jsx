import { useState, useEffect, useRef } from 'react'

const ALL_SECTIONS = [
  { id: 'experience',           label: 'Experience',     views: ['compact', 'detailed'] },
  { id: 'projects',             label: 'Key Projects',   views: ['detailed'] },
  { id: 'skills',               label: 'Skills',         views: ['detailed'] },
  { id: 'education',            label: 'Education',      views: ['compact', 'detailed'] },
  { id: 'certifications',       label: 'Certifications', views: ['compact', 'detailed'] },
  { id: 'independent-projects', label: 'Side Projects',  views: ['detailed'] },
]

function getToolbarHeight() {
  return document.querySelector('.app-toolbar')?.offsetHeight ?? 52
}

/** Fast easeOutCubic scroll — finishes in ~300 ms. */
function fastScrollTo(targetY) {
  const startY = window.scrollY
  const distance = targetY - startY
  if (distance === 0) return
  const duration = 300
  let startTime = null

  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = 1 - (1 - t) ** 3          // easeOutCubic
    window.scrollTo(0, startY + distance * eased)
    if (t < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export default function SectionNav({ view }) {
  const [expanded, setExpanded] = useState(() => window.innerWidth > 1100)
  const [activeId, setActiveId] = useState(null)
  // While true, scroll-based tracking is suppressed so a just-clicked item
  // stays highlighted even if the page barely moves.
  const suppressRef = useRef(false)
  const suppressTimerRef = useRef(null)

  const sections = ALL_SECTIONS.filter(s => s.views.includes(view))

  // Track which section is currently in view
  useEffect(() => {
    const secs = ALL_SECTIONS.filter(s => s.views.includes(view))
    const threshold = getToolbarHeight() + 32

    function update() {
      if (suppressRef.current) return
      let active = secs[0]?.id
      for (const { id } of secs) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= threshold) active = id
      }
      setActiveId(active)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [view])

  // Clean up suppress timer on unmount
  useEffect(() => () => clearTimeout(suppressTimerRef.current), [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (!el) return

    // Immediately mark this item active and hold it for 1 s so the
    // scroll tracker doesn't snap back to whatever section sits at the top.
    setActiveId(id)
    suppressRef.current = true
    clearTimeout(suppressTimerRef.current)
    suppressTimerRef.current = setTimeout(() => {
      suppressRef.current = false
    }, 1000)

    // Flash the section title so the user sees exactly where they landed.
    const titleEl = el.querySelector('.section-title')
    if (titleEl) {
      titleEl.classList.remove('section-title--flash')
      void titleEl.offsetWidth                        // force reflow to restart animation
      titleEl.classList.add('section-title--flash')
      setTimeout(() => titleEl.classList.remove('section-title--flash'), 2200)
    }

    const top = el.getBoundingClientRect().top + window.scrollY - getToolbarHeight() - 16
    fastScrollTo(top)
  }

  return (
    <nav
      className={`section-nav${expanded ? '' : ' section-nav--collapsed'}`}
      aria-label="Page sections"
    >
      <div className="section-nav-header">
        {expanded && <span className="section-nav-label">Sections</span>}
        <button
          className="section-nav-toggle"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d={expanded ? 'M8 2L4 6l4 4' : 'M4 2l4 4-4 4'}
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {expanded && (
        <>
          <div className="section-nav-divider" />
          <ul className="section-nav-list">
            {sections.map(s => (
              <li key={s.id}>
                <button
                  className={`section-nav-item${activeId === s.id ? ' active' : ''}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  )
}
