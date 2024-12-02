import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview as InterviewEntity } from '../entity/interview.entity';
import { Interview as InterviewDomain } from '../../../domain/interview';
import { CreateInterviewReqDto } from '../../../dto/interview.req.dto';
import { SubCategory } from '../entity/sub-category.entity';
import { IInterviewRepository } from 'src/modules/quiz/domain/repository/iinterview.repository';
import { InterviewMapper } from '../../../domain/mapper/interview.mapper';

@Injectable()
export class InterviewRepository implements IInterviewRepository {
  constructor(
    @InjectRepository(InterviewEntity)
    private readonly repository: Repository<InterviewEntity>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(data: CreateInterviewReqDto): Promise<InterviewDomain> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { name: data.subCategory },
    });

    const interview = this.repository.create({
      question: data.question,
      answer: data.answer,
      keywords: data.keywords,
      subCategory,
    });

    const savedEntity = await this.repository.save(interview);
    return InterviewMapper.toDomain(savedEntity);
  }

  async findAll(): Promise<InterviewDomain[]> {
    const entities = await this.repository.find({
      relations: {
        subCategory: true,
      },
    });
    return InterviewMapper.toDomainList(entities);
  }

  async findOne(id: number): Promise<InterviewDomain> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: {
        subCategory: true,
      },
    });
    return InterviewMapper.toDomain(entity);
  }

  async findBySubCategory(subCategoryId: number): Promise<InterviewDomain[]> {
    const entities = await this.repository.find({
      where: {
        subCategory: { id: subCategoryId },
      },
      relations: {
        subCategory: true,
      },
    });
    return InterviewMapper.toDomainList(entities);
  }
}
