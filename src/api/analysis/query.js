const getCategoryQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains&parent=${filters.parent || ''}&is_root=${
    'isRoot' in filters ? filters.isRoot : ''
  }&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

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
  getCategoryQueryString,
  getInputDefinitionQueryString,
  getInputsQueryString,
  getOutputDefinitionQueryString,
  getOutputsQueryString
}
