import BASE from '@/api/base_url.js'

const RESEARCH_API = `${BASE}/research`
const EVENTS = `${RESEARCH_API}/event`
const GROUPS = `${RESEARCH_API}/group`
const LABS = `${RESEARCH_API}/laboratory`
const STUDIES = `${RESEARCH_API}/study`
const STUDY_AGGREGATIONS = `${STUDIES}/aggregate`
const SUBJECTS = `${RESEARCH_API}/subject`
const SUBJECT_INFO_PLOT = `${SUBJECTS}/plot_summary`
const SUBJECTS_CSV = `${SUBJECTS}/to_csv`
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
  STUDY_AGGREGATIONS,
  SUBJECTS,
  SUBJECT_INFO_PLOT,
  SUBJECTS_CSV
}
