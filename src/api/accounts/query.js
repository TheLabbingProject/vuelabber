const getUserQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&username=${filters.username ||
    ''}&page_size=${pagination.rowsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.descending ? '-' + pagination.sortBy : pagination.sortBy
  }`
}

export { getUserQueryString }
