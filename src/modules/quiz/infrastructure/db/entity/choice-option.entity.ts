import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { ChoiceQuiz } from './choice-quiz.entity';

@Entity()
export class ChoiceOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChoiceQuiz, (choiceQuiz) => choiceQuiz.options)
  choice_quiz: ChoiceQuiz;

  @Column()
  content: string;

  @Column()
  is_correct: boolean;

  @Column({ nullable: true })
  description: string;
}
