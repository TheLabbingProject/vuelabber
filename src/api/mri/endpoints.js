import BASE from '@/api/base_url.js'

const MRI_BASE = `${BASE}/mri`
const SCANS = `${MRI_BASE}/scan`
const SEQUENCE_TYPES = `${MRI_BASE}/sequence_type`
const SEQUENCE_TYPE_DEFINITIONS = `${MRI_BASE}/sequence_type_definition`
const SESSIONS = `${MRI_BASE}/session`
const IRB_APPROVALS = `${MRI_BASE}/irb_approval`
const scanPreviewScript = (scanId, elementId) =>
  `${SCANS}/${scanId}/preview_script?elementId=${elementId}`

export {
  IRB_APPROVALS,
  SCANS,
  SEQUENCE_TYPES,
  SEQUENCE_TYPE_DEFINITIONS,
  SESSIONS,
  scanPreviewScript
}
