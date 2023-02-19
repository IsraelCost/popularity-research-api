export interface IJwt {
  /**
   * @param data some data to jwt
   * @param expires 1d | 12h for example
   * @returns token
   */
  generate: (data: any, expires: string) => string
  verify: (token: string) => any
}
