const getUserQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&username=${filters.username ||
    ''}&page_size=${pagination.itemsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.sortBy
      ? pagination.descending
        ? '-' + pagination.sortBy
        : pagination.sortBy
      : ''
  }`
}

export { getUserQueryString }
