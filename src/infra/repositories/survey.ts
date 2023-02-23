import { Injectable } from '@nestjs/common'
import { Question } from '../../domain/entities/question'
import { Survey } from '../../domain/entities/survey'
import { ISurveyRepository } from '../../domain/repositories/survey'
import { SurveyMongoDBModel } from '../db/models/survey'

@Injectable()
export class SurveyRepository implements ISurveyRepository {
  private toModel (data: any): Survey {
    return new Survey({
      id: data.id,
      label: data.label,
      award: data.award,
      questions: data.questions.map((question: any) => new Question({
        id: question.id,
        label: question.label,
        options: question.options
      })),
      cityId: data.cityId,
      term: data.term
    })
  }

  async findAll (): Promise<Survey[]> {
    const surveysData = await SurveyMongoDBModel.find()
    return surveysData.map(this.toModel)
  }

  async findByCity (cityId: string): Promise<Survey[]> {
    const surveysData = await SurveyMongoDBModel.find({ cityId })
    return surveysData.map(this.toModel)
  }

  async findById (id: string): Promise<Survey | null> {
    const surveyData = await SurveyMongoDBModel.findOne({ id })
    if (!surveyData) return null
    return this.toModel(surveyData)
  }

  async save (survey: Survey): Promise<Survey> {
    const surveyData = await SurveyMongoDBModel.create(survey)
    return this.toModel(surveyData)
  }

  async edit (id: string, survey: Survey): Promise<Survey> {
    await SurveyMongoDBModel.updateOne({ id }, survey)
    return (await this.findById(id))!
  }

  async remove (id: string): Promise<void> {
    await SurveyMongoDBModel.deleteOne({ id })
  }
}
