import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FindUserReqDto } from './dto/req.dto';
import { ApiGetResponse } from 'src/common/decorator/swagger.decorator';
import { FindUserResDto } from './dto/res.dto';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto, FindUserResDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.findAll();
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  async findOne(@Param('id') { id }: FindUserReqDto) {
    return await this.userService.findOne(id);
  }
}
