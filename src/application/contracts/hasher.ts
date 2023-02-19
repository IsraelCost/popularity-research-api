export interface IHasher {
  encode: (value: string) => string
  compare: (given: string, toCompare: string) => boolean
}
