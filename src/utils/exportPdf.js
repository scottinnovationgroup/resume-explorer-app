import { createElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import { ResumePdf } from '../components/pdf/ResumePdf'

export async function exportToPdf(data, view, { personName } = {}) {
  const filename = personName
    ? `${personName.replace(/\s+/g, '-')}-Resume.pdf`
    : 'resume.pdf'

  const blob = await pdf(createElement(ResumePdf, { data, view })).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
