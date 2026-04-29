import ResumeHeader from './sections/ResumeHeader'
import ExperienceSection from './sections/ExperienceSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import EducationSection from './sections/EducationSection'
import CertificationsSection from './sections/CertificationsSection'
import IndependentProjectsSection from './sections/IndependentProjectsSection'

export default function ResumeView({ data, view }) {
  const isDetailed = view === 'detailed'
  const isExpanded = view === 'expanded'

  return (
    <article className="resume">
      <ResumeHeader person={data.person} />

      <div id="experience">
        <ExperienceSection
          roles={data.roles}
          resumePoints={data.resume_points}
          view={view}
        />
      </div>

      {isDetailed && (
        <div id="projects">
          <ProjectsSection
            projects={data.projects}
            roles={data.roles}
            companies={data.companies}
          />
        </div>
      )}

      {isDetailed && (
        <div id="skills">
          <SkillsSection skillsCatalog={data.skills_catalog} />
        </div>
      )}

      <div id="education">
        <EducationSection education={data.education} />
      </div>

      <div id="certifications">
        <CertificationsSection certifications={data.certifications} />
      </div>

      {isDetailed && (
        <div id="independent-projects">
          <IndependentProjectsSection projects={data.independent_projects} />
        </div>
      )}
    </article>
  )
}
