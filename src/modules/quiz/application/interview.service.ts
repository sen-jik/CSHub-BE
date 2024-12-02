import { Inject, Injectable } from '@nestjs/common';
import { CreateInterviewReqDto } from '../dto/interview.req.dto';
import { IInterviewRepository } from '../domain/repository/iinterview.repository';
import { InterviewGroupMapper } from '../domain/mapper/interview-group.mapper';
import { GetAllInterviewResDto } from '../dto/interview.res.dto';

@Injectable()
export class InterviewService {
  constructor(
    @Inject('IInterviewRepository')
    private readonly interviewRepository: IInterviewRepository,
  ) {}

  async createInterview(createInterviewReqDto: CreateInterviewReqDto) {
    return await this.interviewRepository.create(createInterviewReqDto);
  }

  async getAllInterview(): Promise<GetAllInterviewResDto> {
    const interviews = await this.interviewRepository.findAll();
    const interviewGroups = InterviewGroupMapper.toGroups(interviews);
    return { items: interviewGroups };
  }
}
