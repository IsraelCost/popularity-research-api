import { City } from '../entities/city'

export interface ICityRepository {
  save: (data: City) => Promise<City>
  edit: (id: string, data: City) => Promise<City>
  findOne: (id: string) => Promise<City | null>
  findAll: () => Promise<City[]>
  remove: (id: string) => Promise<void>
}
