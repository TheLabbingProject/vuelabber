import BASE from '@/api/base_url.js'

const RESEARCH_API = `${BASE}/research`
const GROUPS = `${RESEARCH_API}/groups`
const STUDIES = `${RESEARCH_API}/studies`
const SUBJECTS = `${RESEARCH_API}/subjects`
const SUBJECT_BY_DICOM_PATIENT = `${RESEARCH_API}/subject_from_patient`

export { GROUPS, STUDIES, SUBJECTS, SUBJECT_BY_DICOM_PATIENT }
