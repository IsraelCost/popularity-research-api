import { Vote } from './vote'

export type Option = {
  id: string
  label: string
  picture: string
  votes: Vote[]
}
