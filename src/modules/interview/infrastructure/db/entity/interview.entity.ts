import { SubCategory } from 'src/modules/category/infrastructure/db/entity/sub-category.entity';
import { Like } from 'src/modules/like/infrastructure/db/entity/like.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;

  @Column()
  question: string;

  @Column()
  answer: string;

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Like, (like) => like.interview)
  likes: Like[];
}
