import { Controller, Inject, Post, Patch, Delete, Get, Body, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ISurveyService } from '../../domain/services/survey'
import { IManageVotes } from '../../domain/usecases/manage-votes'
import { IVoting } from '../../domain/usecases/voting'
import { ManageVotesDTO, SafeSurveyDTO, SurveyCreateDTO, SurveyDTO, SurveyUpdateDTO, VotingDTO } from '../dto/survey'

@ApiTags('survey')
@Controller('survey')
export class SurveyController {
  constructor (
    @Inject('SurveySecureService') private readonly service: ISurveyService,
    @Inject('Voting') private readonly votingUseCase: IVoting,
    @Inject('ManageVotes') private readonly manageVotesUseCase: IManageVotes
  ) { }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: SurveyDTO,
    isArray: true
  })
  async loadSurveys (): Promise<SurveyDTO[]> {
    return await this.service.get()
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: SafeSurveyDTO
  })
  async loadSafeSurvey (@Param('id') id: string): Promise<SafeSurveyDTO> {
    return await this.service.getSafe(id)
  }

  @Get(':id/secure')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: SurveyDTO
  })
  async loadSurvey (@Param('id') id: string): Promise<SurveyDTO> {
    return await this.service.getOne(id)
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: SurveyDTO
  })
  async createSurvey (@Body() input: SurveyCreateDTO): Promise<SurveyDTO> {
    return await this.service.create(input)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: SurveyDTO
  })
  async updateSurvey (
    @Param('id') id: string,
      @Body() input: SurveyUpdateDTO
  ): Promise<SurveyDTO> {
    return await this.service.update(id, input)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200
  })
  async deleteSurvey (@Param('id') id: string) {
    await this.service.delete(id)
  }

  @Post(':id/question/:questionId/manage-votes')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200
  })
  async manageVotes (
  @Param('id') surveyId: string,
    @Param('questionId') questionId: string,
    @Body() input: ManageVotesDTO
  ) {
    await this.manageVotesUseCase.manage({
      surveyId,
      questionId,
      ...input
    })
  }

  @Post(':id/question/:questionId/option/:optionId/vote')
  @ApiResponse({
    status: 200
  })
  async vote (
  @Param('id') surveyId: string,
    @Param('questionId') questionId: string,
    @Param('optionId') optionId: string,
    @Body() input: VotingDTO
  ) {
    await this.votingUseCase.vote({
      surveyId,
      questionId,
      optionId,
      deviceIp: input.deviceIp,
      phoneNumber: input.phoneNumber
    })
  }
}
