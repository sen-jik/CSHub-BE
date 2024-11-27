import { Interview } from '../interview';
import { InterviewGroup, InterviewGroups } from '../interview-group.type';
import { InterviewResDto } from '../../dto/interview.res.dto';

export class InterviewGroupMapper {
  static toGroups(interviews: Interview[]): InterviewGroup[] {
    const groupedInterviews = this.groupInterviewsByCategory(interviews);
    return Object.values(groupedInterviews);
  }

  private static toResponseDto(interview: Interview): InterviewResDto {
    return {
      id: interview.id,
      question: interview.question,
      answer: interview.answer,
      keywords: interview.keywords,
      createdAt: interview.createdAt,
    };
  }

  private static groupInterviewsByCategory(
    interviews: Interview[],
  ): InterviewGroups {
    return interviews.reduce((acc, interview) => {
      const { name: categoryName, main_category: mainCategoryName } =
        interview.subCategory;
      const key = this.generateGroupKey(mainCategoryName, categoryName);

      if (!acc[key]) {
        acc[key] = this.createNewGroup(mainCategoryName, categoryName);
      }

      acc[key].interviews.push(this.toResponseDto(interview));
      return acc;
    }, {} as InterviewGroups);
  }

  private static generateGroupKey(
    mainCategory: string,
    subCategory: string,
  ): string {
    return `${mainCategory}-${subCategory}`;
  }

  private static createNewGroup(
    mainCategoryName: string,
    subCategoryName: string,
  ): InterviewGroup {
    return {
      mainCategoryName,
      subCategoryName,
      interviews: [],
    };
  }
}
