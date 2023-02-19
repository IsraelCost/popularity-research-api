export class ApplicationError {
  constructor (
    public message: string,
    public code: number,
    public name: string = ''
  ) { }
}
