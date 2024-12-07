import { Inject, Injectable } from '@nestjs/common';
import { CreateInterviewReqDto } from '../dto/interview.req.dto';
import { IInterviewRepository } from '../domain/repository/iinterview.repository';
import { InterviewGroupMapper } from '../domain/mapper/interview-group.mapper';
import {
  CreateInterviewResDto,
  FindInterviewInfoResDto,
  FindAllInterviewResDto,
} from '../dto/interview.res.dto';

@Injectable()
export class InterviewService {
  constructor(
    @Inject('IInterviewRepository')
    private readonly interviewRepository: IInterviewRepository,
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

  async findOne(id: number): Promise<FindInterviewInfoResDto> {
    const interview = await this.interviewRepository.findById(id);
    return interview;
  }
}
