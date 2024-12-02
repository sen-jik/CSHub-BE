import { InterviewResDto } from '../dto/interview.res.dto';

export type InterviewGroup = {
  mainCategoryName: string;
  subCategoryName: string;
  interviews: InterviewResDto[];
};

export type InterviewGroups = Record<string, InterviewGroup>;
