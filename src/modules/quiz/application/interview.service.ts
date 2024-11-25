import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Interview } from '../infrastructure/db/entity/interview.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInterviewReqDto } from '../dto/interview.req.dto';
import { CategoryService } from './catgegory.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    private readonly categoryService: CategoryService,
  ) {}

  async createInterview({
    question,
    answer,
    keywords,
    subCategory,
  }: CreateInterviewReqDto) {
    const subCategoryEntity =
      await this.categoryService.findSubCategory(subCategory);
    const interview = this.interviewRepository.create({
      question,
      answer,
      keywords,
      subCategory: subCategoryEntity,
    });
    return await this.interviewRepository.save(interview);
  }

  async getAllInterview() {
    return this.interviewRepository.find();
  }
}
