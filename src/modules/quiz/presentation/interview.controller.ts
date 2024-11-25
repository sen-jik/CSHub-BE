import { Body, Controller, Get, Post } from '@nestjs/common';
import { InterviewService } from '../application/interview.service';
import { CreateInterviewReqDto } from '../dto/interview.req.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/modules/user/domain/role.enum';
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { CreateInterviewResDto } from '../dto/interview.res.dto';

@ApiTags('Interview')
@ApiExtraModels(CreateInterviewReqDto, CreateInterviewResDto)
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  async createInterview(
    @Body() createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<CreateInterviewResDto> {
    const { id } = await this.interviewService.createInterview(
      createInterviewReqDto,
    );

    return { id };
  }

  @Get()
  async getAllInterview() {
    return this.interviewService.getAllInterview();
  }
}
