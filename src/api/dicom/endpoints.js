import BASE from '@/api/base_url.js'

const DICOM_BASE = `${BASE}/dicom`
const IMAGES = `${DICOM_BASE}/image`
const PATIENTS = `${DICOM_BASE}/patient`
const SERIES = `${DICOM_BASE}/series`
const STUDIES = `${DICOM_BASE}/study`
const MANUFACTURERS = `${DICOM_BASE}/manufacturersList`

export { IMAGES, PATIENTS, SERIES, STUDIES, MANUFACTURERS }
