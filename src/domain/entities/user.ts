export enum UserProfile {
  ACCESS = 'access',
  ROOT = 'root'
}

export class User {
  constructor (
    public id: string,
    public email: string,
    public name: string,
    public verified: boolean,
    public password: string,
    public profile: UserProfile
  ) { }
}
