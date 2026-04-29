export default function IndependentProjectsSection({ projects }) {
  if (!projects?.length) return null

  return (
    <section className="resume-section">
      <h2 className="section-title">Independent Projects</h2>
      {projects.map(project => (
        <div key={project.independent_project_id} id={`indie-${project.independent_project_id}`} className="indie-project-card">
          <div className="indie-project-header">
            <div className="indie-project-title-row">
              <span className="indie-project-name">{project.project_name}</span>
              <span className="indie-project-type">{project.project_type}</span>
            </div>
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="indie-project-link"
              >
                {project.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <p className="indie-project-summary">{project.summary}</p>
          {project.target_users?.length > 0 && (
            <div className="indie-project-users">
              <span className="meta-label">For:</span>{' '}
              <span className="meta-value">{project.target_users.join(', ')}</span>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
