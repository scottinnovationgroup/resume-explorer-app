import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// A4 dimensions in mm
const PAGE_W = 210
const PAGE_H = 297
const FOOTER_H = 14
const CONTENT_H = PAGE_H - FOOTER_H // 283 mm usable per page
const TOP_PAD = 10 // mm of breathing room at top of pages 2+

// Bottom-edge safety margin in canvas pixels.
// getBoundingClientRect() returns subpixel floats; after multiplying by the
// canvas scale and rounding, the measured block bottom can end up 1-5 canvas
// pixels short of the actual rendered content. This margin absorbs that error.
const BOTTOM_FUDGE = 10

const BLOCK_SELECTORS = [
  '.resume-header',
  '.role-card',
  '.project-card',
  '.indie-project-card',
  '.edu-item',
  '.cert-item',
  '.skill-category',
]

/**
 * Return all no-split zones as { top, bottom } in canvas pixels.
 *
 * - top  uses Math.floor so the protected zone starts as early as possible.
 * - bottom uses Math.ceil + BOTTOM_FUDGE so sub-pixel rendering never causes
 *   the bottom edge to be under-reported, which is the root cause of splits.
 */
function collectBlocks(container, canvasScale) {
  const cTop = container.getBoundingClientRect().top

  const toPx = (cssVal) => cssVal * canvasScale

  const pos = (el) => {
    const r = el.getBoundingClientRect()
    return {
      top: Math.floor(toPx(r.top - cTop)),
      bottom: Math.ceil(toPx(r.bottom - cTop)) + BOTTOM_FUDGE,
    }
  }

  const blocks = []

  // Fine-grained atomic blocks
  container.querySelectorAll(BLOCK_SELECTORS.join(',')).forEach((el) => {
    blocks.push(pos(el))
  })

  // Section title must stay paired with its first content sibling so a
  // heading is never stranded at the bottom of a page alone.
  container.querySelectorAll('.section-title').forEach((titleEl) => {
    const firstItem = titleEl.nextElementSibling
    if (firstItem) {
      blocks.push({ top: pos(titleEl).top, bottom: pos(firstItem).bottom })
    }
  })

  // Same treatment for project role-group labels
  container.querySelectorAll('.projects-role-label').forEach((labelEl) => {
    const firstCard = labelEl.nextElementSibling
    if (firstCard) {
      blocks.push({ top: pos(labelEl).top, bottom: pos(firstCard).bottom })
    }
  })

  return blocks.sort((a, b) => a.top - b.top)
}

/**
 * Find the latest safe cut point at or before `desired` (canvas px).
 *
 * Two-pass approach:
 *   Pass 1 – Walk `y` upward whenever it falls inside any block's interior.
 *            Handles the common case where the ideal cut is mid-block.
 *   Pass 2 – After pass 1, check for blocks that START within this page and
 *            EXTEND past `y`. This catches the case where a block's bottom
 *            was slightly under-measured (BOTTOM_FUDGE handles most, but this
 *            pass is a belt-and-suspenders guard).
 *
 * Falls back to `desired` only when every candidate y ≤ pageStart, meaning
 * a single block is legitimately taller than one full page.
 */
function findSafeCut(blocks, pageStart, desired) {
  let y = desired

  // Pass 1: move y up out of any block interior
  let changed = true
  while (changed) {
    changed = false
    for (const block of blocks) {
      if (block.top < y && y < block.bottom) {
        y = block.top
        changed = true
        break // restart — y moved, earlier blocks may now apply
      }
    }
  }

  // Pass 2: ensure no block that *starts on this page* still straddles y
  changed = true
  while (changed) {
    changed = false
    for (const block of blocks) {
      if (block.top >= pageStart && block.top < y && block.bottom > y) {
        y = block.top
        changed = true
        break
      }
    }
  }

  return y > pageStart ? y : desired
}

/**
 * Produce page slices entirely in canvas pixels.
 * Page 1 gets CONTENT_H worth of content; pages 2+ get CONTENT_H − TOP_PAD
 * (the saved space is used for the visual breathing room at the top).
 */
function computeSlices(canvas, blocks) {
  const mmToCx = (mm) => Math.round(mm * (canvas.width / PAGE_W))

  const firstPageH = mmToCx(CONTENT_H)
  const otherPageH = mmToCx(CONTENT_H - TOP_PAD)
  const totalH = canvas.height

  const slices = []
  let top = 0

  while (top < totalH) {
    const maxH = slices.length === 0 ? firstPageH : otherPageH
    const desired = top + maxH

    if (desired >= totalH) {
      slices.push({ top, height: totalH - top })
      break
    }

    const cut = findSafeCut(blocks, top, desired)
    slices.push({ top, height: cut - top })
    top = cut
  }

  return slices
}

/** Extract a vertical slice of srcCanvas to a fresh canvas → JPEG data URL. */
function sliceToDataUrl(srcCanvas, sliceTop, height) {
  const dst = document.createElement('canvas')
  dst.width = srcCanvas.width
  dst.height = height
  const ctx = dst.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, dst.width, dst.height)
  ctx.drawImage(srcCanvas, 0, -sliceTop)
  return dst.toDataURL('image/jpeg', 0.92)
}

export async function exportToPdf(element, { personName } = {}) {
  const filename = personName
    ? `${personName.replace(/\s+/g, '-')}-Resume.pdf`
    : 'resume.pdf'

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (_doc, clonedEl) => {
      clonedEl.style.boxShadow = 'none'
      clonedEl.style.borderRadius = '0'
    },
  })

  // Measure after html2canvas so we read the fully-settled DOM.
  const canvasScale = canvas.width / element.offsetWidth
  const blocks = collectBlocks(element, canvasScale)
  const slices = computeSlices(canvas, blocks)
  const totalPages = slices.length

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage()

    const { top, height } = slices[i]
    const imgData = sliceToDataUrl(canvas, top, height)
    const imgHeightMm = (height / canvas.width) * PAGE_W
    const yOffset = i === 0 ? 0 : TOP_PAD

    pdf.addImage(imgData, 'JPEG', 0, yOffset, PAGE_W, imgHeightMm, '', 'FAST')

    // Footer divider line
    pdf.setDrawColor(209, 213, 219)
    pdf.setLineWidth(0.25)
    pdf.line(12, PAGE_H - FOOTER_H, PAGE_W - 12, PAGE_H - FOOTER_H)

    // Footer page number
    pdf.setFontSize(7.5)
    pdf.setTextColor(156, 163, 175)
    pdf.text(
      `Page ${i + 1} of ${totalPages}`,
      PAGE_W / 2,
      PAGE_H - FOOTER_H + 6,
      { align: 'center' }
    )
  }

  pdf.save(filename)
}
