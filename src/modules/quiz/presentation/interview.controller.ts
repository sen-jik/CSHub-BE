import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InterviewService } from '../application/interview.service';
import { CreateInterviewReqDto } from '../dto/interview.req.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/modules/user/domain/role.enum';
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateInterviewResDto,
  FindInterviewInfoResDto,
  FindAllInterviewResDto,
  FindInterviewByCategoryResDto,
} from '../dto/interview.res.dto';
import { ApiGetResponse } from 'src/common/decorator/swagger.decorator';

@ApiTags('Interview')
@ApiExtraModels(
  CreateInterviewReqDto,
  CreateInterviewResDto,
  FindInterviewByCategoryResDto,
  FindAllInterviewResDto,
  FindInterviewInfoResDto,
)
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<CreateInterviewResDto> {
    return await this.interviewService.create(createInterviewReqDto);
  }

  @Get()
  @ApiGetResponse(FindAllInterviewResDto)
  async findAll(): Promise<FindAllInterviewResDto> {
    return await this.interviewService.findAll();
  }

  @Get(':id')
  @ApiGetResponse(FindInterviewInfoResDto)
  async findOne(@Param('id') id: number): Promise<FindInterviewInfoResDto> {
    return await this.interviewService.findOne(id);
  }
}
