import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from '../dto/interview.req.dto';
import { IInterviewRepository } from '../domain/repository/iinterview.repository';
import { InterviewGroupMapper } from '../../quiz/domain/mapper/interview-group.mapper';

import {
  InterviewIdDto,
  FindAllInterviewResDto,
  FindInterviewResDto,
  FindInterviewWithLikeResDto,
  SearchInterviewResDto,
} from '../dto/interview.res.dto';
import { LikeService } from 'src/modules/like/application/like.service';
@Injectable()
export class InterviewService {
  constructor(
    @Inject('IInterviewRepository')
    private readonly interviewRepository: IInterviewRepository,
    private readonly likeService: LikeService,
  ) {}

  async create(
    createInterviewReqDto: CreateInterviewReqDto,
  ): Promise<InterviewIdDto> {
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
  ): Promise<SearchInterviewResDto> {
    const { interviews, total } = userId
      ? await this.interviewRepository.searchWithLike(
          userId,
          searchInterviewReqDto,
        )
      : await this.interviewRepository.search(searchInterviewReqDto);

    const { page = 1, limit = 10 } = searchInterviewReqDto;
    const totalPage = Math.ceil(total / limit);

    const interviewsWithLike = interviews.map((interview) => ({
      ...interview,
      isLiked: userId
        ? (interview.likes?.some((like) => like.userId === userId) ?? false)
        : false,
    }));

    return {
      interviews: interviewsWithLike,
      page,
      limit,
      total,
      totalPage,
    };
  }
}
