/* eslint-disable @typescript-eslint/indent */
import { ApiProperty } from '@nestjs/swagger'

export class SignInInput {
  @ApiProperty()
  email!: string

  @ApiProperty()
  password!: string
}

export class SignInOutput {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  verified!: boolean

  @ApiProperty({ enum: ['root', 'access'], default: 'access' })
  profile!: string

  @ApiProperty()
  jwt!: string
}

export class SignUpInput {
  @ApiProperty()
  email!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  password!: string
}

export class SignUpOutput {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  verified!: boolean

  @ApiProperty({ enum: ['root', 'access'], default: 'access' })
  profile!: string
}
