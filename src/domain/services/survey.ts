/* eslint-disable @typescript-eslint/array-type */
import { Award } from '../entities/award'
import { Survey } from '../entities/survey'
import { Vote } from '../entities/vote'

export interface ISurveyService {
  get: () => Promise<Survey[]>
  getOne: (id: string) => Promise<Survey>
  getSafe: (id: string) => Promise<SurveyServiceDTO.Safe>
  create: (input: SurveyServiceDTO.Create) => Promise<Survey>
  update: (id: string, input: SurveyServiceDTO.Update) => Promise<Survey>
  delete: (id: string) => Promise<void>
}

export namespace SurveyServiceDTO {
  export type Create = {
    label: string
    award: Award
    questions: {
      id: string
      label: string
      options: {
        id: string
        label: string
        picture: string
        votes: Vote[]
      }[]
    }[]
    cityId?: string
  }

  export type Update = {
    label?: string
    award?: Award
    questions?: {
      id: string
      label: string
      options: {
        id: string
        label: string
        picture: string
        votes: Vote[]
      }[]
    }[]
    cityId?: string
  }

  export type Safe = {
    id: string
    label: string
    award: Award
    questions: {
      id: string
      label: string
      options: {
        id: string
        label: string
        picture: string
        votes: number
      }[]
    }[]
    cityId?: string
  }
}
