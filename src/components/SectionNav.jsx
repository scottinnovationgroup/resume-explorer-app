import { useState, useEffect, useRef, useMemo } from 'react'

function getToolbarHeight() {
  return document.querySelector('.app-toolbar')?.offsetHeight ?? 49
}

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
    const eased = 1 - (1 - t) ** 3
    window.scrollTo(0, startY + distance * eased)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const SECTION_DEFS = [
  { id: 'experience',           label: 'Experience',     views: ['compact', 'expanded', 'detailed'], hasChildren: true  },
  { id: 'projects',             label: 'Key Projects',   views: ['detailed'],                        hasChildren: true  },
  { id: 'skills',               label: 'Skills',         views: ['detailed']                                            },
  { id: 'education',            label: 'Education',      views: ['compact', 'expanded', 'detailed']                     },
  { id: 'certifications',       label: 'Certifications', views: ['compact', 'expanded', 'detailed']                     },
  { id: 'independent-projects', label: 'Side Projects',  views: ['detailed'],                        hasChildren: true  },
]

function buildSections(data, view) {
  const rolesSorted = [...data.roles].sort((a, b) => b.start_date.localeCompare(a.start_date))

  const projectsByRole = {}
  data.projects.forEach(p => {
    const rid = p.role_ids?.[0]
    if (!projectsByRole[rid]) projectsByRole[rid] = []
    projectsByRole[rid].push(p)
  })

  return SECTION_DEFS
    .filter(s => s.views.includes(view))
    .map(s => {
      if (s.id === 'experience') {
        return {
          ...s,
          children: rolesSorted.map(r => ({
            id: `role-${r.role_id}`,
            label: r.title,
            sub: r.company,
          })),
        }
      }
      if (s.id === 'projects') {
        return {
          ...s,
          children: rolesSorted.flatMap(r =>
            (projectsByRole[r.role_id] ?? []).map(p => ({
              id: `project-${p.project_id}`,
              label: p.project_name,
              sub: r.company,
            }))
          ),
        }
      }
      if (s.id === 'independent-projects') {
        return {
          ...s,
          children: (data.independent_projects ?? []).map(p => ({
            id: `indie-${p.independent_project_id}`,
            label: p.project_name,
          })),
        }
      }
      return s
    })
}

export default function SectionNav({ view, data }) {
  const [expanded, setExpanded] = useState(() => window.innerWidth > 1100)
  const [expandedSections, setExpandedSections] = useState(() => new Set([SECTION_DEFS[0].id]))
  const [activeId, setActiveId] = useState(null)
  const [activeSubId, setActiveSubId] = useState(null)
  const suppressRef = useRef(false)
  const suppressTimerRef = useRef(null)

  function toggleSection(id) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSectionClick(s) {
    scrollTo(s.id)
    if (s.children?.length && !expandedSections.has(s.id)) {
      setExpandedSections(new Set([s.id]))
    }
  }

  const sections = useMemo(() => buildSections(data, view), [data, view])

  const allSubItems = useMemo(() =>
    sections.flatMap(s => (s.children ?? []).map(c => ({ sectionId: s.id, subId: c.id }))),
    [sections]
  )

  // Sync toolbar height to CSS variable so the nav top stays flush
  useEffect(() => {
    const h = getToolbarHeight()
    document.documentElement.style.setProperty('--toolbar-h', `${h}px`)
  }, [])

  // Sync body class so app-main margin adjusts with collapse state
  useEffect(() => {
    document.body.classList.toggle('nav-collapsed', !expanded)
    return () => document.body.classList.remove('nav-collapsed')
  }, [expanded])

  // Scroll-based active tracking
  useEffect(() => {
    function update() {
      if (suppressRef.current) return
      const threshold = getToolbarHeight() + 32

      let activeSec = sections[0]?.id
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= threshold) activeSec = id
      }
      setActiveId(activeSec)

      let activeSub = null
      for (const { subId } of allSubItems) {
        const el = document.getElementById(subId)
        if (el && el.getBoundingClientRect().top <= threshold) activeSub = subId
      }
      // Default to first child of active section if none explicitly reached yet
      if (!activeSub && activeSec) {
        const sec = sections.find(s => s.id === activeSec)
        if (sec?.children?.length) activeSub = sec.children[0].id
      }
      setActiveSubId(activeSub)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [sections, allSubItems])

  useEffect(() => () => clearTimeout(suppressTimerRef.current), [])

  function getScrollOffset(el, parentSectionId) {
    let offset = getToolbarHeight() + 16
    if (!parentSectionId) return offset

    // Account for sticky section title
    const sectionEl = document.getElementById(parentSectionId)
    const titleEl = sectionEl?.querySelector('.section-title')
    if (titleEl) offset += titleEl.offsetHeight

    // Key Projects has a second sticky role label above each group
    if (parentSectionId === 'projects') {
      const roleLabel = el.closest('.projects-role-group')?.querySelector('.projects-role-label')
      if (roleLabel) offset += roleLabel.offsetHeight
    }

    return offset
  }

  function scrollTo(id, parentSectionId = null) {
    const el = document.getElementById(id)
    if (!el) return

    setActiveId(parentSectionId ?? id)
    setActiveSubId(parentSectionId ? id : null)
    suppressRef.current = true
    clearTimeout(suppressTimerRef.current)
    suppressTimerRef.current = setTimeout(() => { suppressRef.current = false }, 1000)

    const offset = getScrollOffset(el, parentSectionId)
    const top = el.getBoundingClientRect().top + window.scrollY - offset
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
      <div className="section-nav-divider" />
      {expanded && (
        <ul className="section-nav-list">
          {sections.map(s => {
            const sectionExpanded = expandedSections.has(s.id)
            return (
              <li key={s.id} className="section-nav-group">
                <div className="section-nav-item-row">
                  <button
                    className={`section-nav-item${activeId === s.id ? ' active' : ''}`}
                    onClick={() => handleSectionClick(s)}
                  >
                    {s.label}
                  </button>
                  {s.children?.length > 0 && (
                    <button
                      className={`section-nav-expand${sectionExpanded ? ' open' : ''}`}
                      onClick={() => toggleSection(s.id)}
                      aria-label={sectionExpanded ? `Collapse ${s.label}` : `Expand ${s.label}`}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path
                          d="M2 4l3 3 3-3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {s.children?.length > 0 && (
                  <div className={`section-nav-children-wrap${sectionExpanded ? ' open' : ''}`}>
                    <ul className="section-nav-children">
                      {s.children.map(c => (
                        <li key={c.id}>
                          <button
                            className={`section-nav-child${activeSubId === c.id ? ' active' : ''}`}
                            onClick={() => scrollTo(c.id, s.id)}
                          >
                            <span className="section-nav-child-label">{c.label}</span>
                            {c.sub && <span className="section-nav-child-sub">{c.sub}</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
