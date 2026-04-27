export default function SkillsSection({ skillsCatalog }) {
  // Group by skill_category
  const categories = {}
  skillsCatalog.forEach(skill => {
    const cat = skill.skill_category || 'General'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push(skill.skill_name)
  })

  return (
    <section className="resume-section">
      <h2 className="section-title">Skills</h2>
      <div className="skills-grid">
        {Object.entries(categories).map(([cat, skills]) => (
          <div key={cat} className="skill-category">
            <div className="skill-category-label">{cat}</div>
            {skills.map(skill => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
