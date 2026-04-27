export default function ResumeHeader({ person }) {
  const { name, headline, location, contact, links } = person
  const linkedin = links?.find(l => l.type === 'linkedin')

  return (
    <header className="resume-header">
      <h1 className="resume-name">{name}</h1>
      <p className="resume-headline">{headline}</p>
      <div className="resume-contact">
        <span>{location.display}</span>
        <span className="contact-sep">·</span>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <span className="contact-sep">·</span>
        <span>{contact.phone}</span>
        {linkedin && (
          <>
            <span className="contact-sep">·</span>
            <a href={linkedin.url} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </>
        )}
      </div>
    </header>
  )
}
