import session from '@/api/session'
import {
  ACCOUNT,
  CHANGE_PASSWORD,
  LOGIN,
  LOGOUT,
  RESET_PASSWORD,
  SEND_RESET_PASSWORD_EMAIL
} from './endpoints'

export default {
  login(username, password) {
    return session.post(LOGIN, { username, password })
  },
  logout() {
    return session.post(LOGOUT, {})
  },
  changeAccountPassword(password1, password2) {
    return session.post(CHANGE_PASSWORD, {
      password1,
      password2
    })
  },
  sendAccountPasswordResetEmail(email) {
    return session.post(SEND_RESET_PASSWORD_EMAIL, { email })
  },
  resetAccountPassword(uid, token, new_password1, new_password2) {
    return session.post(RESET_PASSWORD, {
      uid,
      token,
      new_password1,
      new_password2
    })
  },
  getAccountDetails() {
    return session.get(ACCOUNT)
  },
  updateAccountDetails(data) {
    return session.patch(ACCOUNT, data)
  }
}
