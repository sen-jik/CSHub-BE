import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from '../application/catgegory.service';
import { Role } from 'src/modules/user/domain/role.enum';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/role.decorator';
import { CreateSubCategoryReqDto } from '../dto/category.req.dto';

@ApiTags('Category')
@ApiExtraModels(CreateSubCategoryReqDto)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post()
  async createSubCategory(@Body() body: CreateSubCategoryReqDto) {
    return this.categoryService.createSubCategory(body);
  }
}
