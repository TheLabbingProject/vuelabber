import { camelToSnake } from '@/utils.js'

let urlToId = url => {
  let urlParts = url.split('/')
  return Number(urlParts[urlParts.length - 2])
}

const parseOrdering = options => {
  return options.sortBy && options.sortDesc
    ? options.sortBy
        .map((value, index) => {
          let snakeValue = camelToSnake(value)
          return options.sortDesc[index] ? '-' + snakeValue : snakeValue
        })
        .join(',')
    : ''
}

export { urlToId, parseOrdering }
