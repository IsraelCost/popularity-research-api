import { UserProfile } from '../entities/user'

export interface IAuthentication {
  authenticate: (input: AuthenticationDTO.Input) => Promise<AuthenticationDTO.Output>
}

export namespace AuthenticationDTO {
  export type Input = {
    email: string
    password: string
  }

  export type Output = {
    id: string
    verified: boolean
    name: string
    email: string
    profile: UserProfile
    jwt: string
  }
}
