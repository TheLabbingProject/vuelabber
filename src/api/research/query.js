import { parseOrdering } from '@/api/utils'

const getStudyQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains&n_subjects_min=${filters.nSubjectsMin ||
    ''}&n_subjects_max=${filters.nSubjectsMax || ''}${
    filters.collaborators
      ? filters.collaborators.map(pk => `&collaborators=${pk}`)
      : ''
  }${
    filters.procedures ? filters.procedures.map(pk => `&procedures=${pk}`) : ''
  }&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getEventQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains&content_type=${filters.contentType ||
    ''}&model_name=${filters.modelName || ''}&app_label=${filters.appLabel ||
    ''}${
    filters.procedure
      ? filters.procedure
          .map(procedureId => `&procedure=${procedureId}`)
          .join('')
      : ''
  }${
    filters.study
      ? filters.study.map(studyId => `&study=${studyId}`).join('')
      : ''
  }${
    filters.excludeProcedure
      ? filters.excludeProcedure
          .map(procedureId => `&exclude_procedure=${procedureId}`)
          .join('')
      : ''
  }&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getSubjectQueryString = ({ filters, options }) => {
  return `?id=${filters.pk || ''}&id_number=${filters.idNumber ||
    ''}&id_number_lookup=icontains&first_name=${filters.firstName ||
    ''}&first_name_lookup=icontains&last_name=${filters.lastName ||
    ''}&last_name_lookup=icontains&sex=${filters.sex ||
    ''}&gender=${filters.gender || ''}&born_after_date=${filters.bornAfter ||
    ''}&born_before_date=${filters.bornBefore ||
    ''}&dominant_hand=${filters.dominantHand ||
    ''}&dicom_patient=${filters.dicomPatientId || ''}&study=${filters.studies ||
    ''}&procedure=${filters.procedures ||
    ''}&measurement=${filters.dataAcquisition ||
    ''}&study_group=${filters.groups ||
    ''}&mri_session_time_after=${filters.mriSessionAfter ||
    ''}&mri_session_time_before=${filters.mriSessionBefore ||
    ''}&questionnaire_id=${filters.questionnaireId || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getGroupQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains${
    filters.study
      ? filters.study.map(studyId => `&study=${studyId}`).join('')
      : ''
  }&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getProcedureQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains${
    filters.studies
      ? filters.studies.map(studyId => `&study=${studyId}`).join('')
      : ''
  }${
    filters.excludeStudy ? `&exclude_study=${filters.excludeStudy}` : ''
  }&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getProcedureStepQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&index=${filters.index ||
    ''}&event_type=${filters.eventType || ''}${
    filters.dataModel
      ? filters.dataModel.map(model => `&content_type=${model}`).join('')
      : ''
  }&procedure=${filters.procedure || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getDataAcquisitionQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&app_label=${filters.appLabel ||
    ''}&app_label_lookup=exact&model=${filters.model ||
    ''}&model_lookup=exact&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

export {
  getDataAcquisitionQueryString,
  getEventQueryString,
  getGroupQueryString,
  getProcedureQueryString,
  getProcedureStepQueryString,
  getStudyQueryString,
  getSubjectQueryString
}
