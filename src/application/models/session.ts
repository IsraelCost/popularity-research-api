import { UserProfile } from '../../domain/entities/user'

export type Session = {
  id: string
  email: string
  name: string
  verified: boolean
  profile: UserProfile
}
