import { City } from '../entities/city'

export interface ICityService {
  create: (data: CityServiceDTO.Create) => Promise<City>
  update: (id: string, data: CityServiceDTO.Update) => Promise<City>
  getOne: (id: string) => Promise<City>
  get: () => Promise<City[]>
  delete: (id: string) => Promise<void>
}

export namespace CityServiceDTO {
  export type Create = Omit<City, 'id'>

  export type Update = Partial<Omit<City, 'id'>>
}
