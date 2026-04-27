export default function CertificationsSection({ certifications }) {
  return (
    <section className="resume-section">
      <h2 className="section-title">Certifications</h2>
      <div className="certs-list">
        {certifications.map(cert => (
          <div key={cert.certification_id} className="cert-item">
            <span className="cert-name">
              {cert.certification_name}
              {cert.certification_abbreviation
                ? ` (${cert.certification_abbreviation})`
                : ''}
            </span>
            <span className="cert-meta">
              {cert.issuing_organization}
              {cert.credential_id ? ` · #${cert.credential_id}` : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
