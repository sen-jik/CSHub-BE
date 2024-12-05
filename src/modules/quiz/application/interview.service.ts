import { Inject, Injectable } from '@nestjs/common';
import { CreateInterviewReqDto } from '../dto/interview.req.dto';
import { IInterviewRepository } from '../domain/repository/iinterview.repository';
import { InterviewGroupMapper } from '../domain/mapper/interview-group.mapper';
import {
  CreateInterviewResDto,
  FindInterviewInfoResDto,
  FindAllInterviewResDto,
  FindInterviewInfoWithLikeResDto,
} from '../dto/interview.res.dto';
import { LikeService } from './like.service';
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
  ): Promise<FindInterviewInfoResDto | FindInterviewInfoWithLikeResDto> {
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
}
