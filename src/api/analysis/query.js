const getInputDefinitionQueryString = ({ filters, pagination }) => {
  return `?key=${filters.key || ''}&required=${filters.required ||
    ''}&is_configuration=${filters.isConfiguration ||
    ''}&input_specification=${filters.inputSpecification ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

const getOutputDefinitionQueryString = ({ filters, pagination }) => {
  return `?key=${filters.key ||
    ''}&output_specification=${filters.outputSpecification ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

const getInputsQueryString = ({ filters, pagination }) => {
  return `?run=${filters.run || ''}&page_size=${pagination.itemsPerPage ||
    100}&page=${pagination.page || 1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

const getOutputsQueryString = ({ filters, pagination }) => {
  return `?run=${filters.run || ''}&page_size=${pagination.itemsPerPage ||
    100}&page=${pagination.page || 1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

export {
  getInputDefinitionQueryString,
  getInputsQueryString,
  getOutputDefinitionQueryString,
  getOutputsQueryString
}
