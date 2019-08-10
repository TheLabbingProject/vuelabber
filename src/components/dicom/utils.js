const sexOptions = { Male: 'M', Female: 'F', Other: 'O' }

const formatSpatialResolution = floatArray => {
  return floatArray
    .map(item => parseFloat(item.toFixed(2)))
    .toString()
    .replace(/,/g, ' x ')
    .trim()
}

export { formatSpatialResolution, sexOptions }
