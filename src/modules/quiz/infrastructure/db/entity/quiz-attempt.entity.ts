import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from 'src/modules/user/infrastructure/db/entity/user.entity';
import { ChoiceQuiz } from './choice-quiz.entity';

@Entity()
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.attempts)
  user: User;

  @ManyToOne(() => ChoiceQuiz, { nullable: true })
  choice_quiz: ChoiceQuiz;

  @Column()
  correct: boolean;

  @Column()
  score: number;

  @CreateDateColumn()
  created_at: Date;
}
