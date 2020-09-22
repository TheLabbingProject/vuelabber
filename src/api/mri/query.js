const getScanQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&description=${filters.description ||
    ''}&description_lookup=icontains&dicom_id_in=${filters.dicomIdIn ? filters.dicomIdIn.join() : ''
    }&number=${filters.number ||
    ''}&created_after=&created_before=&scan_time_after=${filters.afterDate ||
    ''}&scan_time_before=${filters.beforeDate ||
    ''}&echo_time=&inversion_time=&repetition_time=&institution_name=&is_updated_from_dicom=&dicom__id=${filters.dicomId ||
    ''}&sequence_type=${filters.sequenceType || ''}&session=${filters.session ||
    ''}&page_size=${options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
    }&page=${options.page || 1}&ordering=${options.descending ? '-' + options.sortBy : options.sortBy
    }`
}

const getSessionQueryString = ({ filters, options }) => {
  return `?subject=${filters.subject || ''}&created_after=&created_before=&time_after=${filters.afterDate ||
    ''}&time_before=${filters.beforeDate ||
    ''}&page_size=${options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
    }&page=${options.page || 1}&ordering=${options.descending ? '-' + options.sortBy : options.sortBy
    }`
}

export { getScanQueryString, getSessionQueryString }
