// ─── Sample Data Model Configuration ──────────────────────────────────────────
// This is the fallback config used when config.js is not present.
//
// To get started:
//   1. Copy this file and rename it to config.js
//   2. Update the import below to point at your own JSON data file
//   3. Your JSON must follow the same structure as src/data/sample.json
//
// Examples:
//   import resumeData from './data/sample.json'
//   import resumeData from '../my-resume.json'

import resumeData from './data/sample.json'

export default resumeData

// ─── App Options ───────────────────────────────────────────────────────────────
export const options = {
  showBrandIcon:  true,  // Show/hide the document icon next to the brand
  showBrandTitle: true,  // Show/hide the "Resume Explorer" label
  brandIcon:      null,  // Path to a custom icon in /public (e.g. '/icon.png'). Null uses the default SVG.
}
