export interface IVerificateEmail {
  verificate: (hash: string) => Promise<void>
}
