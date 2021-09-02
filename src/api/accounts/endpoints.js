import BASE from '@/api/base_url.js'

const ACCOUNTS_BASE = `${BASE}/accounts`
const USERS = `${ACCOUNTS_BASE}/user`
const PROFILES = `${ACCOUNTS_BASE}/profile`
const LABS = `${ACCOUNTS_BASE}/laboratory`
const EXPORT_DESTINATIONS = `${ACCOUNTS_BASE}/export_destination`

export { ACCOUNTS_BASE, PROFILES, LABS, USERS, EXPORT_DESTINATIONS }
