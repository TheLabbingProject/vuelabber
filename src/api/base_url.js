const DEVELOPMENT = 'http://localhost:8000/api'
const PRODUCTION = process.env.VUE_APP_IP + '/api'

const MODE = process.env.VUE_APP_MODE || 'Development'

var BASE = DEVELOPMENT
if (MODE == 'Production') {
  BASE = PRODUCTION
}

export default BASE
