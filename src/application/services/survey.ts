import { Injectable, Inject } from '@nestjs/common'
import { Award } from '../../domain/entities/award'
import { ApplicationError } from '../../domain/entities/error'
import { Question } from '../../domain/entities/question'
import { Survey } from '../../domain/entities/survey'
import { ICityRepository } from '../../domain/repositories/city'
import { ISurveyRepository } from '../../domain/repositories/survey'
import { ISurveyService, SurveyServiceDTO } from '../../domain/services/survey'
import { FileSystemFolders, IFileSystem } from '../contracts/file-system'
import { IIdGenerator } from '../contracts/id-generator'
import { IWebSocket } from '../contracts/websocket'

@Injectable()
export class SurveyService implements ISurveyService {
  constructor (
    @Inject('SurveyRepository') private readonly surveyRepository: ISurveyRepository,
    @Inject('IdGenerator') private readonly idGenerator: IIdGenerator,
    @Inject('FileSystem') private readonly fileSystem: IFileSystem,
    @Inject('Websocket') private readonly websocket: IWebSocket,
    @Inject('CityRepository') private readonly cityRepository: ICityRepository
  ) { }

  async get (): Promise<Survey[]> {
    return await this.surveyRepository.findAll()
  }

  async getOne (id: string): Promise<Survey> {
    const survey = await this.surveyRepository.findById(id)

    if (!survey) throw new ApplicationError('Enquete não encontrada', 404)

    return survey
  }

  async getSafe (id: string): Promise<SurveyServiceDTO.Safe> {
    const survey = await this.getOne(id)

    return {
      id: survey.id,
      award: survey.award,
      label: survey.label,
      questions: survey.questions.map(question => ({
        id: question.id,
        label: question.label,
        options: question.options.map(option => ({
          id: option.id,
          label: option.label,
          picture: option.picture,
          votes: option.votes.length
        }))
      })),
      cityId: survey.cityId
    }
  }

  async create (input: SurveyServiceDTO.Create): Promise<Survey> {
    const awardPicture = await this.fileSystem.save(FileSystemFolders.AWARD_PICTURES, input.award.id, input.award.picture)

    const award: Award = {
      id: input.award.picture,
      name: input.award.name,
      picture: awardPicture
    }

    const survey = new Survey({
      id: this.idGenerator.generate(),
      label: input.label,
      award,
      questions: [],
      cityId: input.cityId,
      term: input.term
    })

    for (const questionData of input.questions) {
      const question = new Question({
        id: questionData.id,
        label: questionData.label,
        options: []
      })

      for (const option of questionData.options) {
        const picture = await this.fileSystem.save(FileSystemFolders.OPTIONS_PICTURES, option.id, option.picture)

        question.addOption({
          id: option.id,
          label: option.label,
          picture,
          votes: []
        })
      }

      survey.addQuestion(question)
    }

    return await this.surveyRepository.save(survey)
  }

  async update (id: string, input: SurveyServiceDTO.Update): Promise<Survey> {
    const survey = await this.surveyRepository.findById(id)

    if (!survey) throw new ApplicationError('Enquete não encontrada', 404)

    if (input.cityId !== undefined) {
      const city = await this.cityRepository.findOne(input.cityId)

      survey.cityId = city ? input.cityId : ''
    }

    if (input.award) {
      const awardPicture = await this.fileSystem.save(FileSystemFolders.AWARD_PICTURES, input.award.id, input.award.picture)

      const award: Award = {
        id: input.award.picture,
        name: input.award.name,
        picture: awardPicture
      }

      survey.award = award
    }

    if (input.questions) {
      const questions = []

      for (const questionData of input.questions) {
        const question = new Question({
          id: questionData.id,
          label: questionData.label,
          options: []
        })

        for (const option of questionData.options) {
          const picture = await this.fileSystem.save(FileSystemFolders.OPTIONS_PICTURES, option.id, option.picture)

          question.addOption({
            id: option.id,
            label: option.label,
            picture,
            votes: option.votes
          })
        }

        questions.push(question)
      }

      survey.questions = questions
    }

    survey.label = input.label || survey.label
    survey.term = input.term || survey.term

    this.websocket.emitToAll('vote', survey.id)

    return await this.surveyRepository.edit(id, survey)
  }

  async delete (id: string): Promise<void> {
    const survey = await this.surveyRepository.findById(id)

    if (!survey) throw new ApplicationError('Enquete não encontrada', 404)

    await this.surveyRepository.remove(id)
  }
}
