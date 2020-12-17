const getPatientQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&uid=${filters.uid ||
    ''}&uid_lookup=icontains&born_after_date=${filters.bornAfter ||
    ''}&born_before_date=${filters.bornBefore ||
    ''}&name_prefix=&given_name=${filters.firstName ||
    ''}&given_name_lookup=icontains&middle_name=&middle_name_lookup=&family_name=${filters.lastName ||
    ''}&family_name_lookup=icontains&name_suffix=&sex=${
    filters.sex ? filters.sex[0] : ''
  }&study__id=${filters.studyId || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${
    options.descending ? '-' + options.sortBy : options.sortBy
  }`
}

const getSeriesQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&uid=${filters.uid ||
    ''}&study_uid=${filters.studyUid ||
    ''}&study_description=${filters.studyDescription ||
    ''}&modality=${filters.modality || ''}&description=${filters.description ||
    ''}&description_lookup=icontains&protocol_name=&number=${filters.number ||
    ''}&created_after_date=${filters.afterDate ||
    ''}&created_before_date=${filters.beforeDate || ''}&date=${filters.date ||
    ''}&created_after_time=${filters.afterTime ||
    ''}&created_before_time=${filters.beforeTime || ''}&echo_time_min=${
    filters.echoTime && 'min' in filters.echoTime ? filters.echoTime.min : ''
  }&echo_time_max=${
    filters.echoTime && 'max' in filters.echoTime ? filters.echoTime.max : ''
  }&inversion_time_min=${
    filters.inversionTime && 'min' in filters.inversionTime
      ? filters.inversionTime.min
      : ''
  }&inversion_time_max=${
    filters.inversionTime && 'max' in filters.inversionTime
      ? filters.inversionTime.max
      : ''
  }&repetition_time_min=${
    filters.repetitionTime && 'min' in filters.repetitionTime
      ? filters.repetitionTime.min
      : ''
  }&repetition_time_max=${
    filters.repetitionTime && 'max' in filters.repetitionTime
      ? filters.repetitionTime.max
      : ''
  }&flip_angle=${filters.flipAngle || ''}&manufacturer=${filters.manufacturer ||
    ''}&manufacturer_model_name=${filters.manufacturersModelName ||
    ''}&pixel_spacing_min=${
    filters.pixelSpacing && 'min' in filters.pixelSpacing
      ? filters.pixelSpacing.min
      : ''
  }&pixel_spacing_max=${
    filters.pixelSpacing && 'max' in filters.pixelSpacing
      ? filters.pixelSpacing.max
      : ''
  }&slice_thickness_min=${
    filters.sliceThickness && 'min' in filters.sliceThickness
      ? filters.sliceThickness.min
      : ''
  }&slice_thickness_max=${
    filters.sliceThickness && 'max' in filters.sliceThickness
      ? filters.sliceThickness.max
      : ''
  }&magnetic_field_strength=${filters.magneticFieldStrength ||
    ''}&device_serial_number=${filters.deviceSerialNumber ||
    ''}&institution_name=${filters.institutionName ||
    ''}&pulse_sequence_name=${filters.pulseSequenceName ||
    ''}&sequence_name=${filters.sequenceName ||
    ''}&patient__id=${filters.patientId ||
    ''}&header_fields=${filters.headerFields || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${
    options.descending ? '-' + options.sortBy : options.sortBy
  }`
}

const getStudyQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&uid=${filters.uid ||
    ''}&description=${filters.description ||
    ''}&description_lookup=icontains&created_after_date=${filters.afterDate ||
    ''}&created_before_date=${filters.beforeDate ||
    ''}&created_after_time=${filters.afterTime ||
    ''}&created_before_time=${filters.beforeTime || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${
    options.descending ? '-' + options.sortBy : options.sortBy
  }`
}

export { getPatientQueryString, getSeriesQueryString, getStudyQueryString }
