const DEVELOPMENT = 'http://localhost:8000/api'
const PRODUCTION = 'http://' + process.env.APP_IP + '/api'

const MODE = process.env.APP_MODE || 'Development'

var BASE = DEVELOPMENT
if (MODE == 'Production') {
  BASE = PRODUCTION
}

export default BASE
