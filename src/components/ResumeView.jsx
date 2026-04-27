import { forwardRef } from 'react'
import ResumeHeader from './sections/ResumeHeader'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import EducationSection from './sections/EducationSection'
import CertificationsSection from './sections/CertificationsSection'
import IndependentProjectsSection from './sections/IndependentProjectsSection'

const ResumeView = forwardRef(function ResumeView({ data, view }, ref) {
  const isDetailed = view === 'detailed'

  return (
    <article className="resume" ref={ref}>
      <ResumeHeader person={data.person} />

      <ExperienceSection
        roles={data.roles}
        companies={data.companies}
        projects={data.projects}
        view={view}
      />

      {isDetailed && (
        <ProjectsSection
          projects={data.projects}
          roles={data.roles}
          companies={data.companies}
        />
      )}

      {isDetailed && (
        <SkillsSection skillsCatalog={data.skills_catalog} />
      )}

      <EducationSection education={data.education} />

      <CertificationsSection certifications={data.certifications} />

      {isDetailed && (
        <IndependentProjectsSection projects={data.independent_projects} />
      )}
    </article>
  )
})

export default ResumeView
