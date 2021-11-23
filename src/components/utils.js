function isObject(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
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

export function isInteger(n) {
  return Number(n) === n && n % 1 === 0
}

export function isFloat(n) {
  return Number(n) === n && n % 1 !== 0
}

export const SEQUENCE_TYPE_ITEMS = [
  { text: 'DWI', value: 'dwi' },
  {
    text: 'DWI SBRef',
    value: 'dwi_sbref'
  },
  {
    text: 'DWI Fieldmap',
    value: 'dwi_fieldmap'
  },
  { text: 'DWI (derived)', value: 'dwi_derived' },
  {
    text: 'FLAIR',
    value: 'flair'
  },
  { text: 'fMRI', value: 'bold' },
  {
    text: 'fMRI Fieldmap',
    value: 'func_fieldmap'
  },
  {
    text: 'fMRI SBRef',
    value: 'func_sbref'
  },
  { text: 'IR-EPI', value: 'ir_epi' },
  { text: 'Localizer', value: 'localizer' },
  { text: 'MPRAGE', value: 'mprage' },
  {
    text: 'T2-weighted',
    value: 't2w'
  },
  { text: 'Physio Log', value: 'physio_log' },
  { text: 'Unknown', value: 'null' }
]

export const SEQUENCE_TYPE_STYLING = {
  dwi: { color: 'purple', textColor: 'white' },
  dwi_sbref: { color: 'purple', textColor: 'black' },
  dwi_derived: { color: 'purple lighten-1', textColor: 'grey' },
  dwi_fieldmap: { color: 'purple', textColor: 'white' },
  flair: { color: 'grey lighten-1', textColor: 'black' },
  bold: { color: 'orange', textColor: 'white' },
  func_fieldmap: { color: 'orange', textColor: 'black' },
  func_sbref: { color: 'orange', textColor: 'black' },
  ir_epi: { color: 'teal', textColor: 'white' },
  localizer: { color: 'blue-grey' },
  mprage: { color: 'green', textColor: 'white' },
  t2w: { color: 'grey darken-1', textColor: 'white' },
  physio_log: { color: 'grey', textColor: 'white' },
  null: { color: 'grey' }
}
