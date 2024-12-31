import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { ChoiceOption } from './choice-option.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { SubCategory } from '../../../../category/infrastructure/db/entity/sub-category.entity';

@Entity()
export class ChoiceQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => ChoiceOption, (option) => option.choice_quiz)
  options: ChoiceOption[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.choice_quiz)
  attempts: QuizAttempt[];
}
