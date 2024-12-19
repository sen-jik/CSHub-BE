import { Interview as InterviewEntity } from '../../infrastructure/db/entity/interview.entity';
import { Interview as InterviewDomain } from '../interview';

export class InterviewMapper {
  static toDomain(entity: InterviewEntity): InterviewDomain {
    const domain = new InterviewDomain();

    domain.id = entity.id;
    domain.question = entity.question;
    domain.answer = entity.answer;
    domain.keywords = entity.keywords;
    domain.subCategory = {
      id: entity.subCategory.id,
      name: entity.subCategory.name,
      main_category: entity.subCategory.main_category,
    };
    domain.createdAt = entity.created_at;
    domain.likes = entity.likes?.map((like) => ({
      userId: like.user.id,
    }));

    return domain;
  }

  static toDomainList(entities: InterviewEntity[]): InterviewDomain[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
