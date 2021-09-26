import BASE from '@/api/base_url.js'

const RESEARCH_API = `${BASE}/research`
const EVENTS = `${RESEARCH_API}/event`
const GROUPS = `${RESEARCH_API}/group`
const LABS = `${RESEARCH_API}/laboratory`
const STUDIES = `${RESEARCH_API}/study`
const SUBJECTS = `${RESEARCH_API}/subject`
const EXPORT_SUBJECT_DATA = `${SUBJECTS}/export/`
const PROCEDURES = `${RESEARCH_API}/procedure`
const PROCEDURE_STEPS = `${RESEARCH_API}/procedure_step`
const MEASUREMENT_DEFINITIONS = `${RESEARCH_API}/measurement`
const DATA_ACQUISITIONS = `${RESEARCH_API}/data_acquisition`

export {
  DATA_ACQUISITIONS,
  EVENTS,
  EXPORT_SUBJECT_DATA,
  GROUPS,
  LABS,
  MEASUREMENT_DEFINITIONS,
  PROCEDURES,
  PROCEDURE_STEPS,
  STUDIES,
  SUBJECTS
}
