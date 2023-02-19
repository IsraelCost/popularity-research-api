import { Inject, Injectable } from '@nestjs/common'
import { ApplicationError } from '../../domain/entities/error'
import { ISurveyRepository } from '../../domain/repositories/survey'
import { IVoting, VotingDTO } from '../../domain/usecases/voting'
import { IWebSocket } from '../contracts/websocket'
import { IValidation } from '../validation/leaves/contract'

@Injectable()
export class Voting implements IVoting {
  constructor (
    @Inject('SurveyRepository') private readonly surveyRepository: ISurveyRepository,
    @Inject('VotingValidation') private readonly validation: IValidation,
    @Inject('Websocket') private readonly websocket: IWebSocket
  ) { }

  async vote (input: VotingDTO.Input): Promise<VotingDTO.Output> {
    this.validation.validate(input)
    const survey = await this.surveyRepository.findById(input.surveyId)
    if (!survey) throw new ApplicationError('Enquete não encontrada', 404)
    const question = survey.getQuestion(input.questionId)
    if (!question) throw new ApplicationError('Questão não encontrada', 404)
    question.vote(input.optionId, {
      deviceIp: input.deviceIp,
      phoneNumber: input.phoneNumber
    })
    await this.surveyRepository.edit(input.surveyId, survey)
    this.websocket.emitToAll('vote', survey.id)
  }
}
