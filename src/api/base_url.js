const DEVELOPMENT = 'http://localhost:8080/api'
const PRODUCTION = 'https://pylabber.org/api'

const MODE = 'development'

var BASE = DEVELOPMENT
if (MODE == 'production') {
  BASE = PRODUCTION
}

export default BASE
