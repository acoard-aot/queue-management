/* eslint-disable camelcase */

export interface User {
  display_name: string
  email: string
  last_name: string
  telephone: string
  user_id: number
  username: string
  send_reminders: boolean
}

export interface UserUpdateBody {
  email: string
  telephone: string
  send_reminders: boolean
}
