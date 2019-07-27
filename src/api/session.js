import axios from 'axios'

// const DEVELOPMENT = 'http://localhost:8080'
const PRODUCTION = 'https://pylabber.org'

const CSRF_COOKIE_NAME = 'csrftoken'
const CSRF_HEADER_NAME = 'X-CSRFToken'

const session = axios.create({
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME,
  baseURL: `${PRODUCTION}/api/`
})

export default session
