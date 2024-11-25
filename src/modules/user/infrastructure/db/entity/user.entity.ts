import { Role } from 'src/modules/user/domain/role.enum';
import { Provider } from 'src/modules/user/domain/provider.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { QuizAttempt } from 'src/modules/quiz/infrastructure/db/entity/quiz-attempt.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  platformId: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.KAKAO })
  provider: Provider;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ default: 0 })
  total_points: number;

  @Column({ default: 0 })
  current_rank: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => QuizAttempt, (attempt) => attempt.user)
  attempts: QuizAttempt[];

  //   @OneToMany(() => Like, (like) => like.user)
  //   likes: Like[];

  //   @OneToMany(() => Ranking, (ranking) => ranking.user)
  //   rankings: Ranking[];

  //   @OneToMany(() => PointHistory, (pointHistory) => pointHistory.user)
  //   pointHistories: PointHistory[];
}
