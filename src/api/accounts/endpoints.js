import BASE from '@/api/base_url.js'

const ACCOUNTS_BASE = `${BASE}/accounts`
const USERS = `${ACCOUNTS_BASE}/user`
const PROFILES = `${ACCOUNTS_BASE}/profile`
const LABS = `${ACCOUNTS_BASE}/laboratory`
const EXPORT_DESTINATIONS = `${ACCOUNTS_BASE}/export_destination`
const INSTANCE_EXPORT = `${EXPORT_DESTINATIONS}/export_instance/`
const TASK_RESULTS = `${ACCOUNTS_BASE}/task_result`

export {
  ACCOUNTS_BASE,
  PROFILES,
  LABS,
  USERS,
  EXPORT_DESTINATIONS,
  INSTANCE_EXPORT,
  TASK_RESULTS
}
