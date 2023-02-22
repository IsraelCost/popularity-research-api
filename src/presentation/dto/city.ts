/* eslint-disable @typescript-eslint/indent */
import { ApiProperty } from '@nestjs/swagger'

export class CityDTO {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  picture!: string
}

export class CityCreateDTO {
  @ApiProperty()
  name!: string

  @ApiProperty()
  picture!: string
}

export class CityUpdateDTO {
  @ApiProperty()
  name?: string

  @ApiProperty()
  picture?: string
}
