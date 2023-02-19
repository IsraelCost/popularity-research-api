import { UserProfile } from '../entities/user'

export interface ICreateUser {
  create: (input: CreateUserDTO.Input) => Promise<CreateUserDTO.Output>
}

export namespace CreateUserDTO {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    id: string
    verified: boolean
    name: string
    email: string
    profile: UserProfile
  }
}
