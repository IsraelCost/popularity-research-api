import { Controller, Inject, Post, Body, Param, Delete, Patch, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ICityService } from '../../domain/services/city'
import { CityCreateDTO, CityDTO, CityUpdateDTO } from '../dto/city'

@ApiTags('city')
@Controller('city')
export class CityController {
  constructor (
    @Inject('CitySecureService') private readonly cityService: ICityService
  ) { }

  @Get()
  @ApiResponse({
    status: 201,
    type: CityDTO,
    isArray: true
  })
  async get (): Promise<CityDTO[]> {
    return await this.cityService.get()
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    type: CityDTO
  })
  async getOne (@Param('id') id: string): Promise<CityDTO> {
    return await this.cityService.getOne(id)
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: CityDTO
  })
  async create (@Body() input: CityCreateDTO): Promise<CityDTO> {
    return await this.cityService.create(input)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: CityDTO
  })
  async update (
    @Param('id') id: string,
      @Body() input: CityUpdateDTO
  ): Promise<CityDTO> {
    return await this.cityService.update(id, input)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200
  })
  async delete (@Param('id') id: string): Promise<void> {
    await this.cityService.delete(id)
  }
}
