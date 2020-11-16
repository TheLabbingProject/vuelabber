const getUserQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&username${filters.username ||
    ''}=&username_lookup=icontains&first_name=${filters.firstName ||
    ''}&first_name_lookup=icontains&last_name=${filters.lastName ||
    ''}&last_name_lookup=icontains&email=${filters.email ||
    ''}&email_lookup=icontains&institute=${filters.institute || ''}${
    filters.study ? `&study=${filters.study}` : ''
  }&page_size=${options.itemsPerPage || 100}&page=${options.page ||
    1}&ordering=${
    options.sortBy
      ? options.sortDesc
        ? '-' + options.sortBy
        : options.sortBy
      : ''
  }`
}

export { getUserQueryString }
