const parseOrdering = options => {
  return options.sortBy && options.sortDesc
    ? options.sortBy
        .map((value, index) => {
          return options.sortDesc[index] ? '-' + value : value
        })
        .join(',')
    : ''
}

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

const getAnalysisQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description${filters.description ||
    ''}=&description_lookup=icontains&created_after=${filters.createdAfter ||
    ''}&created_before=${filters.createdBefore ||
    ''}&category=${filters.category ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

const getAnalysisVersionQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&analysis=${filters.analysis ||
    ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains&created_after=${filters.createdAfter ||
    ''}&created_before=${filters.createdBefore ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

const getInputSpecificationQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&analysis=${filters.analysis ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

const getOutputSpecificationQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&analysis=${filters.analysis ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
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

const getInputsQueryString = ({ filters, options }) => {
  return `?run=${filters.run || ''}&key=${filters.key ||
    ''}&input_type=${filters.inputType || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

const getOutputsQueryString = ({ filters, options }) => {
  return `?run=${filters.run || ''}&key=${filters.key ||
    ''}&output_type=${filters.outputType || ''}&page_size=${
    options.itemsPerPage
      ? options.itemsPerPage != -1
        ? options.itemsPerPage
        : 10000
      : 100
  }&page=${options.page || 1}&ordering=${parseOrdering(options)}`
}

export {
  getCategoryQueryString,
  getAnalysisQueryString,
  getAnalysisVersionQueryString,
  getInputDefinitionQueryString,
  getInputSpecificationQueryString,
  getInputsQueryString,
  getOutputDefinitionQueryString,
  getOutputsQueryString,
  getOutputSpecificationQueryString
}
