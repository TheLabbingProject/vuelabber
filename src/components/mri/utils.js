export const scanningSequences = {
  GR: { name: 'Gradient Recalled', color: 'amber accent-4' },
  SE: { name: 'Spin Echo', color: 'pink accent-4' },
  IR: { name: 'Inversion Recovery', color: 'green accent-4' },
  EP: { name: 'Echo Planar', color: 'cyan accent-4' },
  RM: { name: 'Research Mode', color: 'grey darken-1' }
}

export const sequenceVariants = {
  SK: { name: 'Segmented k-Space', color: 'deep-purple lighten-3' },
  MTC: {
    name: 'Magnetization Transfer Contrast',
    color: 'light-blue lighten-3'
  },
  SS: { name: 'Steady State', color: 'teal lighten-3' },
  TRSS: { name: 'Time Reversed Steady State', color: 'light-green lighten-3' },
  SP: { name: 'Spoiled', color: 'lime lighten-3' },
  MP: { name: 'MAG Prepared', color: 'brown lighten-3' },
  OSP: { name: 'Oversampling Phase', color: 'blue-grey lighten-3' },
  NONE: { name: 'None', color: 'grey lighten-2' }
}

export function getKeyByName(object, name) {
  let keys = Object.keys(object)
  return keys.find(key => object[key]['name'] === name)
}
