import {
  CreateInterviewReqDto,
  SearchInterviewReqDto,
} from '../../application/dto/interview.req.dto';
import { Interview } from '../interview';

export interface IInterviewRepository {
  create(data: CreateInterviewReqDto): Promise<Interview>;
  findAll(): Promise<Interview[]>;
  findById(id: number): Promise<Interview>;
  findBySubCategory(subCategoryId: number): Promise<Interview[]>;
  search(
    data: SearchInterviewReqDto,
  ): Promise<{ interviews: Interview[]; total: number }>;
  searchWithLike(
    userId: number,
    data: SearchInterviewReqDto,
  ): Promise<{ interviews: Interview[]; total: number }>;
}
