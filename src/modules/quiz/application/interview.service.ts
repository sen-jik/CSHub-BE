import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from './dto/interview.req.dto';
import { IInterviewRepository } from '../domain/repository/iinterview.repository';
import { InterviewGroupMapper } from '../domain/mapper/interview-group.mapper';

import { LikeService } from './like.service';
import {
  CreateInterviewResDto,
  FindAllInterviewResDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  SearchInterviewResDto,
  SearchInterviewWithLikeResDto,
} from './dto/interview.res.dto';
@Injectable()
export class InterviewService {
  constructor(
    @Inject('IInterviewRepository')
    private readonly interviewRepository: IInterviewRepository,
    private readonly likeService: LikeService,
  ) {}

  async create(
    createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<CreateInterviewResDto> {
    const interview = await this.interviewRepository.create(
      createInterviewReqDto,
    );
    return { id: interview.id };
  }

  async findAll(): Promise<FindAllInterviewResDto> {
    const interviews = await this.interviewRepository.findAll();
    const interviewGroups = InterviewGroupMapper.toGroups(interviews);
    return { items: interviewGroups };
  }

  async findOne(
    id: number,
    userId?: number,
  ): Promise<FindInterviewResDto | FindInterviewWithLikeResDto> {
    const interview = await this.interviewRepository.findById(id);

    if (!userId) {
      return interview;
    }

    const like = await this.likeService.findOne(id, userId);

    return {
      ...interview,
      isLiked: !!like,
    };
  }

  async search(
    userId: number,
    searchInterviewReqDto: SearchInterviewReqDto,
  ): Promise<SearchInterviewResDto | SearchInterviewWithLikeResDto> {
    const { interviews, total } = userId
      ? await this.interviewRepository.searchWithLike(
          userId,
          searchInterviewReqDto,
        )
      : await this.interviewRepository.search(searchInterviewReqDto);

    const { page = 1, limit = 10 } = searchInterviewReqDto;
    const totalPage = Math.ceil(total / limit);

    if (userId) {
      return {
        interviews: interviews.map((interview) => ({
          ...interview,
          isLiked:
            interview.likes?.some((like) => like.userId === userId) ?? false,
        })),
        page,
        limit,
        total,
        totalPage,
      };
    }

    return {
      interviews,
      page,
      limit,
      total,
      totalPage,
    };
  }
}
