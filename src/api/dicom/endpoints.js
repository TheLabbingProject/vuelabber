import BASE from '@/api/base_url.js'

const DICOM_BASE = `${BASE}/dicom`
const PATIENTS = `${DICOM_BASE}/patients`
const SERIES = `${DICOM_BASE}/series`
const STUDIES = `${DICOM_BASE}/studies`

export { PATIENTS, SERIES, STUDIES }
