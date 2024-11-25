import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { SubCategory } from './sub-category.entity';

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
}
