import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/user/infrastructure/db/entity/user.entity';
import { ChoiceQuiz } from '../../../../quiz/infrastructure/db/entity/choice-quiz.entity';
import { Interview } from 'src/modules/interview/infrastructure/db/entity/interview.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Interview, { nullable: true })
  @JoinColumn({ name: 'interview_id' })
  interview: Interview;

  @ManyToOne(() => ChoiceQuiz, { nullable: true })
  @JoinColumn({ name: 'quiz_id' })
  quiz: ChoiceQuiz;

  @CreateDateColumn()
  created_at: Date;
}
