import {
  sexOptions,
  genderOptions,
  dominantHandOptions
} from '@/components/research/choices'

const getSubjectQueryString = ({ filters, pagination }) => {
  return `?id=${filters.id || ''}&first_name=${filters.firstName ||
    ''}&first_name_lookup=icontains&last_name=${filters.lastName ||
    ''}&last_name_lookup=icontains&sex=${sexOptions[filters.sex] ||
    ''}&gender=${genderOptions[filters.gender] ||
    ''}&born_after_date=${filters.bornAfter ||
    ''}&born_before_date=${filters.bornBefore ||
    ''}&dominant_hand=${dominantHandOptions[filters.dominantHand] ||
    ''}&page_size=${pagination.rowsPerPage || 100}&page=${pagination.page ||
    1}&ordering=${
    pagination.descending ? '-' + pagination.sortBy : pagination.sortBy
  }`
}

export { getSubjectQueryString }
