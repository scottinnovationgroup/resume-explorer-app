import { useEffect } from 'react'
import { formatMetricParts } from '../../utils/format'

function MetricBadge({ metric }) {
  const { number, suffix } = formatMetricParts(metric.metric_value, metric.metric_unit)

  return (
    <div className="metric-badge">
      <span className="metric-value">
        {number}{suffix && <span className="metric-value-suffix">{suffix}</span>}
      </span>
      <span className="metric-name">{metric.metric_name}</span>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className="project-name">{project.project_name}</span>
        <span className="project-type">{project.project_type}</span>
      </div>
      <p className="project-summary">{project.summary}</p>

      {project.metrics?.length > 0 && (
        <div className="project-metrics">
          {project.metrics.map(m => (
            <MetricBadge key={m.metric_name} metric={m} />
          ))}
        </div>
      )}

      {project.outcomes?.length > 0 && (
        <ul className="project-outcomes">
          {project.outcomes.map(o => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      )}

      {project.technologies?.length > 0 && (
        <div className="project-tech">
          {project.technologies.map(t => (
            <span key={t} className="tag tag-tech">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectsSection({ projects, roles }) {
  const rolesSorted = [...roles].sort((a, b) => b.start_date.localeCompare(a.start_date))

  const projectsByRole = {}
  projects.forEach(p => {
    const primaryRoleId = p.role_ids?.[0]
    if (!projectsByRole[primaryRoleId]) projectsByRole[primaryRoleId] = []
    projectsByRole[primaryRoleId].push(p)
  })

  // Toggle .is-stuck on each role label when its sentinel scrolls past
  // the sticky offset (toolbar + section-title height ≈ 80px).
  useEffect(() => {
    const sentinels = document.querySelectorAll('.projects-role-sentinel')
    if (!sentinels.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const label = entry.target.nextElementSibling
          label?.classList.toggle('is-stuck', !entry.isIntersecting)
        })
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    )
    sentinels.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="resume-section">
      <h2 className="section-title">Key Projects</h2>
      {rolesSorted.map(role => {
        const roleProjects = projectsByRole[role.role_id]
        if (!roleProjects?.length) return null
        return (
          <div key={role.role_id} className="projects-role-group">
            <div className="projects-role-sentinel" />
            <div className="projects-role-label">
              {role.title} <span className="projects-role-company">· {role.company}</span>
            </div>
            {roleProjects.map(project => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        )
      })}
    </section>
  )
}
