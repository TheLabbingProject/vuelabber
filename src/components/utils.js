function isObject(val) {
  if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
    return true
  }
  return false
}

export function createSelectItemFromObject(object, key, nestedKey) {
  let text = nestedKey ? object[key][nestedKey] : object[key]
  return {
    text: text,
    value: key
  }
}

export function createSelectItemFromArray(array, textKey, valueKey) {
  return valueKey
    ? array.map(element => ({
        text: element[textKey],
        value: element[valueKey]
      }))
    : array.map(element => ({
        text: element[textKey],
        value: element
      }))
}

export function createSelectItems(from, textKey, valueKey) {
  if (isObject(from)) {
    let keys = Object.keys(from)
    return keys.map(key => createSelectItemFromObject(from, key, textKey))
  } else if (Array.isArray(from)) {
    return createSelectItemFromArray(from, textKey, valueKey)
  }
}
