let urlToId = url => {
  let urlParts = url.split('/')
  return Number(urlParts[urlParts.length - 2])
}

const parseOrdering = options => {
  return options.sortBy && options.sortDesc
    ? options.sortBy
        .map((value, index) => {
          return options.sortDesc[index] ? '-' + value : value
        })
        .join(',')
    : ''
}

export { urlToId, parseOrdering }
