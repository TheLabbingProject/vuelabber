import BASE from '@/api/base_url.js'

const RESEARCH_API = `${BASE}/research`
const GROUPS = `${RESEARCH_API}/group`
const LABS = `${RESEARCH_API}/laboratory`
const STUDIES = `${RESEARCH_API}/study`
const SUBJECTS = `${RESEARCH_API}/subject`

export { GROUPS, LABS, STUDIES, SUBJECTS }
