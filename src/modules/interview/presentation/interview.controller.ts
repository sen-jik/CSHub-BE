import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InterviewService } from '../application/interview.service';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/modules/user/domain/role.enum';
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ApiGetResponse } from 'src/common/decorator/swagger.decorator';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationResDto } from 'src/common/dto/pagination.dto';
import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from '../dto/interview.req.dto';
import {
  FindAllInterviewResDto,
  FindInterviewByCategoryResDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  InterviewIdDto,
  SearchInterviewResDto,
} from '../dto/interview.res.dto';
@ApiTags('Interview')
@ApiExtraModels(
  CreateInterviewReqDto,
  InterviewIdDto,
  FindAllInterviewResDto,
  SearchInterviewResDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  FindInterviewByCategoryResDto,
  PaginationResDto,
)
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<InterviewIdDto> {
    return await this.interviewService.create(createInterviewReqDto);
  }

  @Public()
  @Get('/search')
  @ApiGetResponse(SearchInterviewResDto)
  async search(
    @Query() searchInterviewReqDto: SearchInterviewReqDto,
    @User() user?: UserAfterAuth,
  ): Promise<SearchInterviewResDto> {
    return await this.interviewService.search(user?.id, searchInterviewReqDto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get()
  @ApiGetResponse(FindAllInterviewResDto)
  async findAll(): Promise<FindAllInterviewResDto> {
    return await this.interviewService.findAll();
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiGetResponse(FindInterviewResDto)
  async findOne(
    @Param('id') id: number,
    @User() user?: UserAfterAuth,
  ): Promise<FindInterviewResDto | FindInterviewWithLikeResDto> {
    return await this.interviewService.findOne(id, user?.id);
  }
}
