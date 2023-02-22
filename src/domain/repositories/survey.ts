import { Survey } from '../entities/survey'

export interface ISurveyRepository {
  findAll: () => Promise<Survey[]>
  findById: (id: string) => Promise<Survey | null>
  findByCity: (cityId: string) => Promise<Survey[]>
  save: (survey: Survey) => Promise<Survey>
  edit: (id: string, survey: Survey) => Promise<Survey>
  remove: (id: string) => Promise<void>
}
