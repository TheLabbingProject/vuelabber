import BASE from '@/api/base_url.js'

const MRI_BASE = `${BASE}/mri`
const SCANS = `${MRI_BASE}/scan`
const SESSIONS = `${MRI_BASE}/session`
const SESSIONS_CSV = `${SESSIONS}/to_csv`
const IRB_APPROVALS = `${MRI_BASE}/irb_approval`
const scanPreviewScript = (scanId, elementId) =>
  `${SCANS}/${scanId}/preview_script?elementId=${elementId}`

export { IRB_APPROVALS, SCANS, SESSIONS, SESSIONS_CSV, scanPreviewScript }
