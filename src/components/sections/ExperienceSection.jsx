import { formatDateRange, formatMoney } from '../../utils/format'

function Tags({ items, className = 'tag' }) {
  if (!items?.length) return null
  return (
    <div className="tags">
      {items.map(item => (
        <span key={item} className={className}>{item}</span>
      ))}
    </div>
  )
}

function ManagementScope({ scope }) {
  if (!scope) return null
  return (
    <div className="role-meta-block">
      <span className="meta-label">Team:</span>{' '}
      <span className="meta-value">
        {scope.team_size_direct_reports} direct reports
        {scope.team_size_supported_or_mentored
          ? ` · ${scope.team_size_supported_or_mentored} supported/mentored`
          : ''}
      </span>
    </div>
  )
}

function ContractContext({ ctx }) {
  if (!ctx) return null
  return (
    <div className="role-meta-block">
      <span className="meta-label">Contract:</span>{' '}
      <span className="meta-value">
        {ctx.client} · {formatMoney(ctx.contract_value)} · {ctx.period_of_performance}
      </span>
    </div>
  )
}

function DeliveryScope({ scope }) {
  if (!scope) return null
  return (
    <div className="role-meta-block">
      <span className="meta-label">Portfolio:</span>{' '}
      <span className="meta-value">
        {scope.portfolio_projects_tracked} projects tracked
        {scope.total_contract_value
          ? ` · ${formatMoney(scope.total_contract_value)} total contract value`
          : ''}
        {scope.customer_accounts?.length
          ? ` · Accounts: ${scope.customer_accounts.join(', ')}`
          : ''}
      </span>
    </div>
  )
}

const BULLET_TYPE_LABELS = {
  achievement: 'Achievements',
  leadership: 'Leadership',
  founder_project: 'Founder Project',
}

function RoleBullets({ bullets }) {
  if (!bullets?.length) return null

  // Group bullets by bullet_type, preserving first-seen order
  const seen = {}
  for (const b of bullets) {
    const type = b.bullet_type ?? 'other'
    if (!seen[type]) seen[type] = []
    seen[type].push(b)
  }
  const groups = Object.keys(seen).sort().map(type => ({ type, items: seen[type] }))

  return (
    <div className="role-bullets-container">
      {groups.map(({ type, items }) => (
        <div key={type}>
          <span className="bullet-type-label">
            {BULLET_TYPE_LABELS[type] ?? type}
          </span>
          <ul className="role-bullets">
            {items.map(b => (
              <li key={b.bullet_id} className="role-bullet">{b.bullet_text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function RoleCard({ role, bullets, view }) {
  const isDetailed = view === 'detailed'
  const dates = formatDateRange(role.start_date, role.end_date, role.current_role)

  return (
    <div id={`role-${role.role_id}`} className="role-card">
      <div className="role-header">
        <div className="role-header-left">
          <span className="role-title">{role.title}</span>
          <span className="role-company">{role.company}</span>
        </div>
        <div className="role-header-right">
          <span className="role-dates">{dates}</span>
          {role.location && (
            <span className="role-location">{role.location}</span>
          )}
        </div>
      </div>

      {role.role_summary && (
        <p className="role-summary">{role.role_summary}</p>
      )}

      <RoleBullets bullets={bullets} />

      {isDetailed && (
        <>
          {role.management_scope && (
            <ManagementScope scope={role.management_scope} />
          )}
          {role.contract_context && (
            <ContractContext ctx={role.contract_context} />
          )}
          {role.delivery_scope && (
            <DeliveryScope scope={role.delivery_scope} />
          )}
          {role.primary_themes?.length > 0 && (
            <Tags items={role.primary_themes} />
          )}
        </>
      )}
    </div>
  )
}

function CompanyGroup({ company, roles, bulletsByRole, view }) {
  return (
    <div className="company-group">
      {roles.map(role => (
        <RoleCard
          key={role.role_id}
          role={role}
          bullets={bulletsByRole[role.role_id]}
          view={view}
        />
      ))}
    </div>
  )
}

export default function ExperienceSection({ roles, resumePoints, view }) {
  const sorted = [...roles].sort((a, b) => b.start_date.localeCompare(a.start_date))

  const bulletsByRole = {}
  resumePoints?.filter(p => p.status === 'approved').forEach(p => {
    if (!bulletsByRole[p.role_id]) bulletsByRole[p.role_id] = []
    bulletsByRole[p.role_id].push(p)
  })

  // Group consecutive same-company roles
  const companyGroups = []
  for (const role of sorted) {
    const last = companyGroups[companyGroups.length - 1]
    if (last && last.company === role.company) {
      last.roles.push(role)
    } else {
      companyGroups.push({ company: role.company, roles: [role] })
    }
  }

  return (
    <section className="resume-section">
      <h2 className="section-title">Experience</h2>
      {companyGroups.map(group =>
        group.roles.length === 1 ? (
          <RoleCard
            key={group.roles[0].role_id}
            role={group.roles[0]}
            bullets={bulletsByRole[group.roles[0].role_id]}
            view={view}
          />
        ) : (
          <CompanyGroup
            key={group.company}
            company={group.company}
            roles={group.roles}
            bulletsByRole={bulletsByRole}
            view={view}
          />
        )
      )}
    </section>
  )
}
