import { Injectable, Inject } from '@nestjs/common'
import { City } from '../../domain/entities/city'
import { ApplicationError } from '../../domain/entities/error'
import { ICityRepository } from '../../domain/repositories/city'
import { CityServiceDTO, ICityService } from '../../domain/services/city'
import { FileSystemFolders, IFileSystem } from '../contracts/file-system'
import { IIdGenerator } from '../contracts/id-generator'

@Injectable()
export class CityService implements ICityService {
  constructor (
    @Inject('CityRepository') private readonly cityRepository: ICityRepository,
    @Inject('FileSystem') private readonly fileSystem: IFileSystem,
    @Inject('IdGenerator') private readonly idGenerator: IIdGenerator
  ) { }

  async get (): Promise<City[]> {
    return await this.cityRepository.findAll()
  }

  async getOne (id: string): Promise<City> {
    const city = await this.cityRepository.findOne(id)

    if (!city) throw new ApplicationError('Cidade não encontrada', 404)

    return city
  }

  async create (input: CityServiceDTO.Create): Promise<City> {
    const cityId = this.idGenerator.generate()

    const picture = await this.fileSystem.save(FileSystemFolders.CITY_PICTURES, cityId, input.picture)

    const city: City = {
      id: cityId,
      name: input.name,
      picture
    }

    return await this.cityRepository.save(city)
  }

  async update (id: string, input: CityServiceDTO.Update): Promise<City> {
    const city = await this.cityRepository.findOne(id)

    if (!city) throw new ApplicationError('Cidade não encontrada', 404)

    if (input.picture) {
      const picture = await this.fileSystem.save(FileSystemFolders.CITY_PICTURES, city.id, input.picture)

      city.picture = picture
    }

    city.name = input.name || city.name

    return await this.cityRepository.edit(city.id, city)
  }

  async delete (id: string): Promise<void> {
    const city = await this.cityRepository.findOne(id)

    if (!city) throw new ApplicationError('Cidade não encontrada', 404)

    await this.cityRepository.remove(city.id)
  }
}
