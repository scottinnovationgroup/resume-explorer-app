import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import { formatDateRange, formatMoney, formatMetricParts } from '../../utils/format'

// ─── Palette (mirrors the web app) ────────────────────────────────────────────
const BLUE   = '#2563eb'
const DARK   = '#111827'
const MED    = '#374151'
const LIGHT  = '#6b7280'
const FAINT  = '#9ca3af'
const BORDER = '#e5e7eb'
const SOFT   = '#e5e7eb'

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Page
  page: {
    paddingTop: 38,
    paddingHorizontal: 46,
    paddingBottom: 46,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: MED,
    backgroundColor: '#ffffff',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
  },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: DARK, marginBottom: 5 },
  headline: { fontSize: 8.5, color: '#4b5563', marginBottom: 7, textAlign: 'center' },
  contactLine: { fontSize: 7.5, color: LIGHT, textAlign: 'center' },
  contactSep: { color: '#d1d5db' },
  link: { color: BLUE },

  // Section
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: BLUE,
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: BORDER,
  },

  roleCard: {
    marginBottom: 10,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  companyGroup: {
    borderLeftWidth: 1.5,
    borderLeftColor: '#bfdbfe',
    paddingLeft: 16,
    marginLeft: -16,
    marginBottom: 10,
    paddingBottom: 0,
  },

  roleHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  roleLeft: { flex: 1, paddingRight: 10 },
  roleRight: { alignItems: 'flex-end', flexShrink: 0 },
  roleTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: DARK },
  roleCompany: { fontSize: 9, color: MED, marginTop: 2 },
  roleDates: { fontSize: 7.5, color: LIGHT },
  roleLocation: { fontSize: 7, color: FAINT, marginTop: 2 },
  roleSummary: { fontSize: 8.5, color: MED, lineHeight: 1.65, marginTop: 5 },

  // Bullet points
  bulletGroup: {},
  bulletTypeLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: LIGHT,
    marginBottom: 3,
    padding: '5px 0',
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  bulletDash: { fontSize: 8.5, color: FAINT, width: 10, flexShrink: 0 },
  bulletText: { fontSize: 8.5, color: MED, lineHeight: 1.6, flex: 1 },

  // Detailed extras
  metaBlock: { fontSize: 8, color: LIGHT, lineHeight: 1.5 },
  metaBold: { fontFamily: 'Helvetica-Bold', color: MED },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  tagText: { fontSize: 7, color: '#475569' },

  // Projects
  projectGroup: {
    borderLeftWidth: 1.5,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 16,
    marginLeft: -16,
    marginBottom: 22,
  },
  projectGroupLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MED, marginBottom: 7 },
  projectGroupCompany: { fontFamily: 'Helvetica', color: FAINT },
  projectCard: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    gap: 10,
  },
  projectCardHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline' },
  projectName: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: DARK, marginRight: 7 },
  projectType: { fontSize: 7.5, color: FAINT },
  projectSummary: { fontSize: 8, color: '#4b5563', lineHeight: 1.6 },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 0.75,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    minWidth: 75,
  },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  metricValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: BLUE },
  metricValueSuffix: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: BLUE, marginLeft: 1 },
  metricName: { fontSize: 6, color: FAINT, textTransform: 'uppercase' },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  techTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  techTagText: { fontSize: 7, color: '#475569' },

  // Skills
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillCategory: { width: '33%', marginBottom: 10, paddingRight: 8 },
  skillCategoryLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: MED,
    marginBottom: 4,
  },
  skillItem: { fontSize: 8, color: '#4b5563', lineHeight: 1.5 },

  // Education
  eduItem: { marginBottom: 9 },
  eduDegree: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: DARK },
  eduInstitution: { fontSize: 8.5, color: LIGHT, marginTop: 1.5 },

  // Certifications
  certRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 6 },
  certName: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: DARK, marginRight: 6 },
  certMeta: { fontSize: 8, color: LIGHT },

  // Independent projects
  indieCard: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.75,
    borderBottomColor: SOFT,
  },
  indieTitleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: 3 },
  indieName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: DARK, marginRight: 8 },
  indieType: { fontSize: 7.5, color: FAINT },
  indieLinkText: { fontSize: 8, color: BLUE, marginBottom: 4 },
  indieSummary: { fontSize: 8.5, color: MED, lineHeight: 1.65 },
  indieFor: { fontSize: 8, color: LIGHT, marginTop: 4 },

  // Footer (fixed = appears on every page)
  footerDivider: {
    position: 'absolute',
    bottom: 28,
    left: 40,
    right: 40,
    borderTopWidth: 0.25,
    borderTopColor: '#d1d5db',
  },
  footerText: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 7.5,
    color: FAINT,
  },
})

// ─── Shared constants ─────────────────────────────────────────────────────────
const BULLET_TYPE_LABELS = {
  achievement: 'Achievements',
  leadership: 'Leadership',
  founder_project: 'Founder Project',
}

function groupBulletsByType(bullets) {
  if (!bullets?.length) return []
  const seen = {}
  for (const b of bullets) {
    const type = b.bullet_type ?? 'other'
    if (!seen[type]) seen[type] = []
    seen[type].push(b)
  }
  return Object.keys(seen).sort().map(type => ({ type, items: seen[type] }))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PdfHeader({ person }) {
  const { name, headline, location, contact, links } = person
  const linkedin = links?.find(l => l.type === 'linkedin')

  return (
    <View style={S.header}>
      <Text style={S.name}>{name}</Text>
      <Text style={S.headline}>{headline}</Text>
      <Text style={S.contactLine}>
        {location.display}
        <Text style={S.contactSep}> · </Text>
        <Link style={S.link} src={`mailto:${contact.email}`}>{contact.email}</Link>
        <Text style={S.contactSep}> · </Text>
        {contact.phone}
        {linkedin && (
          <Text>
            <Text style={S.contactSep}> · </Text>
            <Link style={S.link} src={linkedin.url}>LinkedIn</Link>
          </Text>
        )}
      </Text>
    </View>
  )
}

function PdfRoleCard({ role, bullets, view, prependTitle = false, isLast = false }) {
  const isDetailed = view === 'detailed'
  const showBullets = view === 'expanded' || view === 'detailed'
  const dates = formatDateRange(role.start_date, role.end_date, role.current_role)
  const cardStyle = isLast
    ? [S.roleCard, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]
    : S.roleCard

  return (
    // Outer card can span pages — individual bullets are the atomic units.
    <View style={cardStyle}>
      {/*
        Header + summary stay together.
        When prependTitle is true this block also carries the section title,
        so the heading is never stranded without content below it.
      */}
      <View wrap={false}>
        {prependTitle && <Text style={S.sectionTitle}>Experience</Text>}
        <View style={S.roleHeader}>
          <View style={S.roleLeft}>
            <Text style={S.roleTitle}>{role.title}</Text>
            <Text style={S.roleCompany}>{role.company}</Text>
          </View>
          <View style={S.roleRight}>
            <Text style={S.roleDates}>{dates}</Text>
            {role.location && <Text style={S.roleLocation}>{role.location}</Text>}
          </View>
        </View>
        {role.role_summary && (
          <Text style={S.roleSummary}>{role.role_summary}</Text>
        )}
      </View>

      {/* Bullets grouped by type, sorted alphabetically — label travels with first bullet */}
      {showBullets && groupBulletsByType(bullets).map(({ type, items }) => {
        const [first, ...rest] = items
        return (
          <View key={type} style={S.bulletGroup}>
            <View wrap={false}>
              <Text style={S.bulletTypeLabel}>{BULLET_TYPE_LABELS[type] ?? type}</Text>
              <View style={S.bulletRow}>
                <Text style={S.bulletDash}>–</Text>
                <Text style={S.bulletText}>{first.bullet_text}</Text>
              </View>
            </View>
            {rest.map(b => (
              <View key={b.bullet_id} style={S.bulletRow} wrap={false}>
                <Text style={S.bulletDash}>–</Text>
                <Text style={S.bulletText}>{b.bullet_text}</Text>
              </View>
            ))}
          </View>
        )
      })}

      {isDetailed && (
        <>
          {role.management_scope && (
            <View style={S.metaBlock}>
              <Text>
                <Text style={S.metaBold}>Team: </Text>
                {role.management_scope.team_size_direct_reports} direct reports
                {role.management_scope.team_size_supported_or_mentored
                  ? ` · ${role.management_scope.team_size_supported_or_mentored} supported`
                  : ''}
              </Text>
            </View>
          )}
          {role.contract_context && (
            <View style={S.metaBlock}>
              <Text>
                <Text style={S.metaBold}>Contract: </Text>
                {role.contract_context.client} · {formatMoney(role.contract_context.contract_value)} · {role.contract_context.period_of_performance}
              </Text>
            </View>
          )}
          {role.delivery_scope && (
            <View style={S.metaBlock}>
              <Text>
                <Text style={S.metaBold}>Portfolio: </Text>
                {role.delivery_scope.portfolio_projects_tracked} projects tracked
                {role.delivery_scope.total_contract_value
                  ? ` · ${formatMoney(role.delivery_scope.total_contract_value)} TCV`
                  : ''}
              </Text>
            </View>
          )}
          {role.primary_themes?.length > 0 && (
            <View style={S.tagsRow}>
              {role.primary_themes.map(t => (
                <View key={t} style={S.tag}>
                  <Text style={S.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  )
}

function PdfMetricBadge({ metric }) {
  const { number, suffix } = formatMetricParts(metric.metric_value, metric.metric_unit)
  return (
    <View style={S.metricBadge} wrap={false}>
      <View style={S.metricValueRow}>
        <Text style={S.metricValue}>{number}</Text>
        {suffix ? <Text style={S.metricValueSuffix}>{suffix}</Text> : null}
      </View>
      <Text style={S.metricName}>{metric.metric_name}</Text>
    </View>
  )
}

function PdfProjectCard({ project, isLast = false }) {
  const cardStyle = isLast
    ? [S.projectCard, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]
    : S.projectCard
  return (
    <View style={cardStyle} wrap={false}>
      <View style={S.projectCardHeader}>
        <Text style={S.projectName}>{project.project_name}</Text>
        <Text style={S.projectType}>{project.project_type}</Text>
      </View>
      <Text style={S.projectSummary}>{project.summary}</Text>
      {project.metrics?.length > 0 && (
        <View style={S.metricsRow}>
          {project.metrics.map(m => <PdfMetricBadge key={m.metric_name} metric={m} />)}
        </View>
      )}
      {project.outcomes?.length > 0 && (
        <View>
          {project.outcomes.map(o => (
            <View key={o} style={S.bulletRow} wrap={false}>
              <Text style={S.bulletDash}>–</Text>
              <Text style={S.bulletText}>{o}</Text>
            </View>
          ))}
        </View>
      )}
      {project.technologies?.length > 0 && (
        <View style={S.techRow}>
          {project.technologies.map(t => (
            <View key={t} style={S.techTag}>
              <Text style={S.techTagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

function PdfProjectsSection({ projects, roles }) {
  const sorted = [...roles].sort((a, b) => b.start_date.localeCompare(a.start_date))
  const byRole = {}
  projects.forEach(p => {
    const id = p.role_ids?.[0]
    if (!byRole[id]) byRole[id] = []
    byRole[id].push(p)
  })
  const groups = sorted.filter(r => byRole[r.role_id]?.length)
  if (!groups.length) return null

  return (
    <View style={S.section}>
      {groups.map((role, idx) => {
        const [firstCard, ...restCards] = byRole[role.role_id]
        return (
          <View key={role.role_id} style={S.projectGroup}>
            {/*
              Every group label must travel with its first card.
              For the first group the section title is included so it is
              never stranded without content below it either.
            */}
            <View wrap={false}>
              {idx === 0 && <Text style={S.sectionTitle}>Key Projects</Text>}
              <Text style={S.projectGroupLabel}>
                {role.title}
                <Text style={S.projectGroupCompany}> · {role.company}</Text>
              </Text>
              <PdfProjectCard project={firstCard} isLast={restCards.length === 0} />
            </View>
            {restCards.map((p, i) => (
              <PdfProjectCard key={p.project_id} project={p} isLast={i === restCards.length - 1} />
            ))}
          </View>
        )
      })}
    </View>
  )
}

function PdfSkillsSection({ skillsCatalog }) {
  const categories = {}
  skillsCatalog.forEach(s => {
    const cat = s.skill_category || 'General'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(s.skill_name)
  })
  // Wrap title + entire grid together — skills are compact and the title
  // must never be stranded without at least the first category below it.
  return (
    <View style={S.section} wrap={false}>
      <Text style={S.sectionTitle}>Skills</Text>
      <View style={S.skillsGrid}>
        {Object.entries(categories).map(([cat, skills]) => (
          <View key={cat} style={S.skillCategory}>
            <Text style={S.skillCategoryLabel}>{cat}</Text>
            {skills.map(s => <Text key={s} style={S.skillItem}>{s}</Text>)}
          </View>
        ))}
      </View>
    </View>
  )
}

function PdfEduItem({ edu }) {
  return (
    <View style={S.eduItem}>
      <Text style={S.eduDegree}>
        {edu.degree}{edu.degree_abbreviation ? ` (${edu.degree_abbreviation})` : ''}
      </Text>
      <Text style={S.eduInstitution}>
        {edu.institution}{edu.location ? ` · ${edu.location}` : ''}
      </Text>
    </View>
  )
}

function PdfEducationSection({ education }) {
  const [first, ...rest] = education
  return (
    <View style={S.section}>
      <View wrap={false}>
        <Text style={S.sectionTitle}>Education</Text>
        {first && <PdfEduItem edu={first} />}
      </View>
      {rest.map(edu => (
        <View key={edu.education_id} wrap={false}>
          <PdfEduItem edu={edu} />
        </View>
      ))}
    </View>
  )
}

function PdfCertRow({ cert }) {
  return (
    <View style={S.certRow}>
      <Text style={S.certName}>
        {cert.certification_name}
        {cert.certification_abbreviation ? ` (${cert.certification_abbreviation})` : ''}
      </Text>
      <Text style={S.certMeta}>
        · {cert.issuing_organization}
        {cert.credential_id ? ` · #${cert.credential_id}` : ''}
      </Text>
    </View>
  )
}

function PdfCertificationsSection({ certifications }) {
  const [first, ...rest] = certifications
  return (
    <View style={S.section}>
      <View wrap={false}>
        <Text style={S.sectionTitle}>Certifications</Text>
        {first && <PdfCertRow cert={first} />}
      </View>
      {rest.map(cert => (
        <View key={cert.certification_id} wrap={false}>
          <PdfCertRow cert={cert} />
        </View>
      ))}
    </View>
  )
}

function PdfIndieCard({ p }) {
  return (
    <View style={S.indieCard}>
      <View style={S.indieTitleRow}>
        <Text style={S.indieName}>{p.project_name}</Text>
        <Text style={S.indieType}>{p.project_type}</Text>
      </View>
      {p.website && (
        <Link style={S.indieLinkText} src={p.website}>
          {p.website.replace(/^https?:\/\//, '')}
        </Link>
      )}
      <Text style={S.indieSummary}>{p.summary}</Text>
      {p.target_users?.length > 0 && (
        <Text style={S.indieFor}>
          <Text style={S.metaBold}>For: </Text>
          {p.target_users.join(', ')}
        </Text>
      )}
    </View>
  )
}

function PdfIndependentProjectsSection({ projects }) {
  if (!projects?.length) return null
  const [first, ...rest] = projects
  return (
    <View style={S.section}>
      <View wrap={false}>
        <Text style={S.sectionTitle}>Independent Projects</Text>
        <PdfIndieCard p={first} />
      </View>
      {rest.map(p => (
        <View key={p.independent_project_id} wrap={false}>
          <PdfIndieCard p={p} />
        </View>
      ))}
    </View>
  )
}

function PdfFooter() {
  const { hostname, port } = window.location
  const standardPorts = { 'http:': '80', 'https:': '443' }
  const isStandardPort = !port || port === standardPorts[window.location.protocol]
  const domain = isStandardPort ? hostname : `${hostname}:${port}`

  return (
    <>
      <View fixed style={S.footerDivider} />
      <Link
        fixed
        src={window.location.origin}
        style={[S.footerText, { left: 40, right: 'auto', textAlign: 'left', textDecoration: 'none', color: FAINT }]}
      >
        {domain}
      </Link>
      <Text
        fixed
        style={[S.footerText, { left: 'auto', right: 40, textAlign: 'right' }]}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </>
  )
}

function PdfCompanyGroup({ company, roles, bulletsByRole, view, prependTitle = false }) {
  return (
    <View style={S.companyGroup}>
      <View wrap={false}>
        {prependTitle && <Text style={S.sectionTitle}>Experience</Text>}
        <PdfRoleCard
          role={roles[0]}
          bullets={bulletsByRole[roles[0].role_id]}
          view={view}
        />
      </View>
      {roles.slice(1).map(role => (
        <PdfRoleCard
          key={role.role_id}
          role={role}
          bullets={bulletsByRole[role.role_id]}
          view={view}
        />
      ))}
    </View>
  )
}

function PdfExperienceSection({ roles, resumePoints, view }) {
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
    <View style={S.section}>
      {companyGroups.map((group, idx) => {
        return group.roles.length === 1 ? (
          <PdfRoleCard
            key={group.roles[0].role_id}
            role={group.roles[0]}
            bullets={bulletsByRole[group.roles[0].role_id]}
            view={view}
            prependTitle={idx === 0}
          />
        ) : (
          <PdfCompanyGroup
            key={group.company}
            company={group.company}
            roles={group.roles}
            bulletsByRole={bulletsByRole}
            view={view}
            prependTitle={idx === 0}
          />
        )
      })}
    </View>
  )
}

// ─── Main document ────────────────────────────────────────────────────────────
export function ResumePdf({ data, view }) {
  const isDetailed = view === 'detailed'

  return (
    <Document>
      <Page size="A4" style={S.page}>
        <PdfHeader person={data.person} />

        <PdfExperienceSection roles={data.roles} resumePoints={data.resume_points} view={view} />

        {isDetailed && (
          <PdfProjectsSection projects={data.projects} roles={data.roles} />
        )}

        {isDetailed && (
          <PdfSkillsSection skillsCatalog={data.skills_catalog} />
        )}

        <PdfEducationSection education={data.education} />

        <PdfCertificationsSection certifications={data.certifications} />

        {isDetailed && (
          <PdfIndependentProjectsSection projects={data.independent_projects} />
        )}

        <PdfFooter />
      </Page>
    </Document>
  )
}
