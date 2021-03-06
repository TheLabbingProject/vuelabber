const camelToSnakeCase = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const parseOrdering = options => {
  let sortBy = options.sortBy ? options.sortBy : []
  let sortDesc = options.sortDesc ? options.sortDesc : []
  return sortBy
    .map((value, index) => {
      return sortDesc[index]
        ? '-' + camelToSnakeCase(value)
        : camelToSnakeCase(value)
    })
    .join(',')
}

const getStudyQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains&page_size=${
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
    ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getSubjectQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&first_name=${filters.firstName ||
    ''}&first_name_lookup=icontains&last_name=${filters.lastName ||
    ''}&last_name_lookup=icontains&sex=${filters.sex ||
    ''}&gender=${filters.gender || ''}&born_after_date=${filters.bornAfter ||
    ''}&born_before_date=${filters.bornBefore ||
    ''}&dominant_hand=${filters.dominantHand ||
    ''}&dicom_patient=${filters.dicomPatientId || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getGroupQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&description=${filters.description ||
    ''}&description_lookup=icontains&study=${filters.studyId || ''}&page_size=${
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
    filters.studyId ? `&study=${filters.studyId}` : ''
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
    ''}&procedure=${filters.procedure || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 1000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

export {
  getEventQueryString,
  getGroupQueryString,
  getProcedureQueryString,
  getProcedureStepQueryString,
  getStudyQueryString,
  getSubjectQueryString
}
