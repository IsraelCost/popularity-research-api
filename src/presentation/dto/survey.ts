/* eslint-disable @typescript-eslint/indent */
import { ApiProperty } from '@nestjs/swagger'

export class VoteDTO {
  @ApiProperty()
  deviceIp!: string

  @ApiProperty()
  phoneNumber!: string
}

export class OptionDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: string

  @ApiProperty()
  picture!: string

  @ApiProperty({ type: VoteDTO, isArray: true })
  votes!: VoteDTO[]
}

export class QuestionDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: string

  @ApiProperty({ type: OptionDTO, isArray: true })
  options!: OptionDTO[]
}

export class SurveyDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: string

  @ApiProperty({ type: QuestionDTO, isArray: true })
  questions!: QuestionDTO[]
}

export class SafeOptionDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: string

  @ApiProperty()
  picture!: string

  @ApiProperty()
  votes!: number
}

export class SafeQuestionDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: string

  @ApiProperty({ type: SafeOptionDTO, isArray: true })
  options!: SafeOptionDTO[]
}

export class SafeSurveyDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  label!: string

  @ApiProperty({ type: SafeQuestionDTO, isArray: true })
  questions!: SafeQuestionDTO[]
}

export class SurveyCreateDTO {
  @ApiProperty()
  label!: string

  @ApiProperty({ type: QuestionDTO, isArray: true })
  questions!: QuestionDTO[]
}

export class SurveyUpdateDTO {
  @ApiProperty()
  label?: string

  @ApiProperty({ type: QuestionDTO, isArray: true })
  questions?: QuestionDTO[]
}

export class VotingDTO {
  @ApiProperty()
  deviceIp!: string

  @ApiProperty()
  phoneNumber!: string
}
