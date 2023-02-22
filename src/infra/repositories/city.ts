import { Injectable } from '@nestjs/common'
import { City } from '../../domain/entities/city'
import { ICityRepository } from '../../domain/repositories/city'
import { CityMongoDBModel } from '../db/models/city'

@Injectable()
export class CityRepository implements ICityRepository {
  private toModel (data: any): City {
    return data
  }

  async findAll (): Promise<City[]> {
    const surveysData = await CityMongoDBModel.find()
    return surveysData.map(this.toModel)
  }

  async findOne (id: string): Promise<City | null> {
    const surveyData = await CityMongoDBModel.findOne({ id })
    if (!surveyData) return null
    return this.toModel(surveyData)
  }

  async save (survey: City): Promise<City> {
    const surveyData = await CityMongoDBModel.create(survey)
    return this.toModel(surveyData)
  }

  async edit (id: string, survey: City): Promise<City> {
    await CityMongoDBModel.updateOne({ id }, survey)
    return (await this.findOne(id))!
  }

  async remove (id: string): Promise<void> {
    await CityMongoDBModel.deleteOne({ id })
  }
}
