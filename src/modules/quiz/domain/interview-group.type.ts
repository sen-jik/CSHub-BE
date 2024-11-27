import { Interview } from './interview';

export type InterviewGroup = {
  mainCategoryName: string;
  subCategoryName: string;
  interviews: Interview[];
};

export type InterviewGroups = Record<string, InterviewGroup>;
