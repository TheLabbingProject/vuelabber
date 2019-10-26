const getSubjectQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&firstName=${filters.firstName ||
    ''}&firstName_lookup=icontains&lastName=${filters.lastName ||
    ''}&lastName_lookup=icontains&sex=${filters.sex ||
    ''}&gender=${filters.gender || ''}&born_after_date=${filters.bornAfter ||
    ''}&born_before_date=${filters.bornBefore ||
    ''}&dominant_hand=${filters.dominantHand ||
    ''}&dicom_patient=${filters.dicomPatientId ||
    ''}&page_size=${pagination.rowsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.descending ? '-' + pagination.sortBy : pagination.sortBy
  }`
}

export { getSubjectQueryString }
