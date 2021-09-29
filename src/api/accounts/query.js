const getUserQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&username=${filters.username ||
    ''}&username_lookup=icontains&first_name=${filters.firstName ||
    ''}&first_name_lookup=icontains&last_name=${filters.lastName ||
    ''}&last_name_lookup=icontains&email=${filters.email ||
    ''}&email_lookup=icontains&institute=${filters.institute || ''}${
    filters.study ? `&study=${filters.study}` : ''
  }&study_ne=${filters.studyNotEqual || ''}&page_size=${options.itemsPerPage ||
    100}&page=${options.page || 1}&ordering=${
    options.sortBy
      ? options.sortDesc
        ? '-' + options.sortBy
        : options.sortBy
      : ''
  }`
}

const getExportDestinationQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&title=${filters.title ||
    ''}&title_lookup=icontains&description=${filters.description ||
    ''}&description_lookup=icontains&ip=${filters.ip ||
    ''}&ip_lookup=icontains&username=${filters.username ||
    ''}&username_lookup=icontains&destination=${filters.destination ||
    ''}&destination_lookup=icontains&user_in=${
    filters.users ? filters.users.join() : ''
  }&page_size=${options.itemsPerPage || 100}&page=${options.page ||
    1}&ordering=${
    options.sortBy
      ? options.sortDesc
        ? '-' + options.sortBy
        : options.sortBy
      : ''
  }`
}

const getTaskResultQueryString = ({ filters, options }) => {
  return `?id=${filters.id || ''}&task_id=${filters.taskId ||
    ''}&task_id_lookup=icontains&task_name=${filters.taskName ||
    ''}&task_name_lookup=icontains&page_size=${options.itemsPerPage ||
    100}&page=${options.page || 1}&ordering=${
    options.sortBy
      ? options.sortDesc
        ? '-' + options.sortBy
        : options.sortBy
      : ''
  }`
}

export {
  getExportDestinationQueryString,
  getUserQueryString,
  getTaskResultQueryString
}
