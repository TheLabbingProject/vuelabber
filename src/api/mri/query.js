const getScanQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&description=${filters.description ||
    ''}&description_lookup=icontains&dicom_id_in=${
    filters.dicomIdIn ? filters.dicomIdIn.join() : ''
  }&number=${filters.number ||
    ''}&created_after=&created_before=&scan_time_after=${filters.afterDate ||
    ''}&scan_time_before=${filters.beforeDate ||
    ''}&echo_time=&inversion_time=&repetition_time=&institution_name=&is_updated_from_dicom=&dicom__id=${filters.dicomId ||
    ''}&subject=${filters.subject || ''}&page_size=${pagination.rowsPerPage ||
    100}&page=${pagination.page || 1}&ordering=${
    pagination.descending ? '-' + pagination.sortBy : pagination.sortBy
  }`
}

export { getScanQueryString }
