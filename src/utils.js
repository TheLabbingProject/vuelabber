export function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length != b.length) return false

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export const camelToSnakeCase = obj => {
  let result = {}
  Object.keys(obj).forEach(
    key =>
      (result[key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)] =
        obj[key])
  )
  return result
}

export const camelToSnake = string => {
  return string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

export function isEmptyArray(array) {
  return array === undefined || array.length == 0
}

export function isEmptyObject(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

export const titlesDictionary = {
  BSC: 'B.Sc.',
  MSC: 'M.Sc.',
  PHD: 'Ph.D.',
  PROF: 'Prof.'
}

export const numberOperators = [
  { text: 'Greater than', value: 'gt' },
  { text: 'Greater Equal than', value: 'gte' },
  { text: 'Lower than', value: 'lt' },
  { text: 'Lower Equal than', value: 'lte' },
  { text: 'Equal', value: 'exact' }
]
