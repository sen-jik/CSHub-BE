import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview as InterviewEntity } from '../entity/interview.entity';
import { Interview as InterviewDomain } from '../../../domain/interview';
import { IInterviewRepository } from 'src/modules/interview/domain/repository/iinterview.repository';
import { InterviewMapper } from '../../../domain/mapper/interview.mapper';
import { SubCategory } from '../../../../category/domain/sub-category';
import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from 'src/modules/interview/dto/interview.req.dto';
import { FindInterviewInfoDto } from 'src/modules/interview/dto/interview.res.dto';

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

  async findById(id: number): Promise<InterviewDomain> {
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

  async search(
    data: SearchInterviewReqDto,
  ): Promise<{ interviews: FindInterviewInfoDto[]; total: number }> {
    const { subCategory, search, page = 1, limit = 10 } = data;
    const queryBuilder = this.repository
      .createQueryBuilder('interview')
      .leftJoinAndSelect('interview.subCategory', 'subCategory');

    if (subCategory) {
      queryBuilder.andWhere('subCategory.name = :subCategory', {
        subCategory: subCategory,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(interview.question ILIKE :search OR interview.answer ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      interviews: InterviewMapper.toDomainList(entities),
      total,
    };
  }

  async searchWithLike(
    userId: number,
    data: SearchInterviewReqDto,
  ): Promise<{ interviews: FindInterviewInfoDto[]; total: number }> {
    const { subCategory, search, page = 1, limit = 10 } = data;
    const queryBuilder = this.repository
      .createQueryBuilder('interview')
      .leftJoinAndSelect('interview.subCategory', 'subCategory')
      .leftJoinAndSelect(
        'interview.likes',
        'likes',
        'likes.user_id = :userId',
        { userId },
      )
      .leftJoinAndSelect('likes.user', 'user');

    if (subCategory) {
      queryBuilder.andWhere('subCategory.name = :subCategory', {
        subCategory: subCategory,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(interview.question ILIKE :search OR interview.answer ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      interviews: InterviewMapper.toDomainList(entities),
      total,
    };
  }
}
