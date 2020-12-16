const parseOrdering = options => {
  return options.sortBy && options.sortDesc
    ? options.sortBy
        .map((value, index) => {
          return options.sortDesc[index] ? '-' + value : value
        })
        .join(',')
    : ''
}

const getScanQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&description=${filters.description ||
    ''}&description_lookup=icontains&dicom_id_in=${
    filters.dicomIdIn ? filters.dicomIdIn.join() : ''
  }&number=${filters.number ||
    ''}&created_after=&created_before=&scan_time_after=${filters.afterDate ||
    ''}&scan_time_before=${filters.beforeDate ||
    ''}&echo_time=&inversion_time=&repetition_time=&institution_name=&is_updated_from_dicom=&dicom__id=${filters.dicomId ||
    ''}&sequence_type=${filters.sequenceType || ''}&session=${filters.session ||
    ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getSessionQueryString = ({ filters, options }) => {
  return `?id_in=${
    filters.idIn ? filters.idIn.join(',') : ''
  }&subject_id_in=${filters.subject ||
    ''}&created_after=&created_before=&session_date_after=${filters.afterDate ||
    ''}&session_date_before=${filters.beforeDate || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getIrbApprovalQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&institution=${filters.institution ||
    ''}&institution_lookup=icontains&number=${filters.number ||
    ''}&number_lookup=icontains&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

export { getIrbApprovalQueryString, getScanQueryString, getSessionQueryString }
