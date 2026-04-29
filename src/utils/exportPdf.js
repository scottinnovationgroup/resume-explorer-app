import { createElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import { ResumePdf } from '../components/pdf/ResumePdf'

export async function exportToPdf(data, view, { personName } = {}) {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  const filename = personName
    ? `${personName.replace(/\s+/g, '-')}-Resume-${stamp}.pdf`
    : `resume-${stamp}.pdf`

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
