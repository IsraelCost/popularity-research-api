import { Inject, Injectable } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { Vote } from '../../domain/entities/vote'
import { ISurveyRepository } from '../../domain/repositories/survey'
import { IManageVotes, ManageVotesDTO } from '../../domain/usecases/manage-votes'
import { shuffleArray } from '../../domain/utils/shuffle'
import { IWebSocket } from '../contracts/websocket'
import { IValidation } from '../validation/leaves/contract'

@Injectable()
export class ManageVotes implements IManageVotes {
  constructor (
    @Inject('ManageVotesValidation') private readonly validation: IValidation,
    @Inject('SurveyRepository') private readonly surveyRepository: ISurveyRepository,
    @Inject('Websocket') private readonly websocket: IWebSocket
  ) { }

  async manage (input: ManageVotesDTO.Input): Promise<ManageVotesDTO.Output> {
    this.validation.validate(input)

    const survey = await this.surveyRepository.findById(input.surveyId)
    if (!survey) throw new ApplicationError('Enquete não encontrada', 404)

    const question = survey.getQuestion(input.questionId)
    if (!question) throw new ApplicationError('Questão não encontrada', 404)

    const hasAllOptions = question.options.every(option => {
      const optionInInput = input.options.find(searched => searched.optionId === option.id)
      return !!optionInInput
    })
    if (!hasAllOptions) throw new ApplicationError('Faltam opções para serem preenchidas', 400)

    const sumOfPercentages = input.options.map(option => option.percentage).reduce((previous, current) => previous + current)
    if (sumOfPercentages !== 100) throw new ApplicationError('As porcentagens devem totalizar 100%', 400)

    const invalidPercentage = input.options.some(option => !question.isAValidPercentage(option.percentage))
    if (invalidPercentage) throw new ApplicationError('As porcentagens devem ser múltiplas de um número chave', 400)

    const allVotes = question.options.map(option => option.votes).flat()
    const shuffledVotes = [...shuffleArray<Vote>(allVotes)]
    input.options.forEach(item => {
      const quantity = Math.floor(allVotes.length * (item.percentage / 100))
      const optionInQuestion = question.getOption(item.optionId)
      optionInQuestion.votes = shuffledVotes.splice(0, quantity)
    })

    await this.surveyRepository.edit(survey.id, survey)

    this.websocket.emitToAll('vote', survey.id)
  }
}
