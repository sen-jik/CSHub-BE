import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SubCategoryEnum } from 'src/modules/category/domain/sub-category.enum';
import { MainCategoryEnum } from 'src/modules/category/domain/main-category.enum';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MainCategoryEnum,
  })
  main_category: MainCategoryEnum;

  @Column({
    type: 'enum',
    enum: SubCategoryEnum,
  })
  name: SubCategoryEnum;
}
