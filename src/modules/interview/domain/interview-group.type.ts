import { FindInterviewResDto } from '../dto/interview.res.dto';
export type InterviewGroup = {
  mainCategoryName: string;
  subCategoryName: string;
  interviews: FindInterviewResDto[];
};

export type InterviewGroups = Record<string, InterviewGroup>;
