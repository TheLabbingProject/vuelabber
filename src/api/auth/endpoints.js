import BASE from '@/api/base_url.js'

const ACCOUNT = `${BASE}/auth/user/`
const LOGIN = `${BASE}/auth/login/`
const LOGOUT = `${BASE}/auth/logout/`
const CHANGE_PASSWORD = `${BASE}/auth/password/change/`
const SEND_RESET_PASSWORD_EMAIL = `${BASE}/auth/password/reset/`
const RESET_PASSWORD = `${BASE}/auth/password/reset/confirm/`

export {
  ACCOUNT,
  CHANGE_PASSWORD,
  LOGIN,
  LOGOUT,
  RESET_PASSWORD,
  SEND_RESET_PASSWORD_EMAIL
}
