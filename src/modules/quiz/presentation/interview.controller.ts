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
  FindInterviewInfoWithLikeResDto,
} from '../dto/interview.res.dto';
import { ApiGetResponse } from 'src/common/decorator/swagger.decorator';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Interview')
@ApiExtraModels(
  CreateInterviewReqDto,
  CreateInterviewResDto,
  FindAllInterviewResDto,
  FindInterviewInfoResDto,
  FindInterviewInfoWithLikeResDto,
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

  @Public()
  @Get()
  @ApiGetResponse(FindAllInterviewResDto)
  async findAll(): Promise<FindAllInterviewResDto> {
    return await this.interviewService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiGetResponse(FindInterviewInfoWithLikeResDto)
  async findOne(
    @Param('id') id: number,
    @User() user?: UserAfterAuth,
  ): Promise<FindInterviewInfoResDto | FindInterviewInfoWithLikeResDto> {
    return await this.interviewService.findOne(id, user?.id);
  }
}
