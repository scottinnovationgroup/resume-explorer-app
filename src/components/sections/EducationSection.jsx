export default function EducationSection({ education }) {
  return (
    <section className="resume-section">
      <h2 className="section-title">Education</h2>
      {education.map(edu => (
        <div key={edu.education_id} className="edu-item">
          <div className="edu-degree">
            {edu.degree}
            {edu.degree_abbreviation ? ` (${edu.degree_abbreviation})` : ''}
          </div>
          <div className="edu-institution">
            {edu.institution}
            {edu.location ? ` · ${edu.location}` : ''}
          </div>
          {edu.field_of_study && edu.field_of_study !== 'Business Administration' && (
            <div className="edu-field">{edu.field_of_study}</div>
          )}
        </div>
      ))}
    </section>
  )
}
