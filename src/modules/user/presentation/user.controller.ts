import { Controller, Get, Param } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from '../application/user.service';
import { FindUserReqDto } from '../dto/req.dto';
import { ApiGetResponse } from 'src/common/decorator/swagger.decorator';
import { FindUserResDto } from '../dto/res.dto';
import { UserAfterAuth } from 'src/common/decorator/user.decorator';
import { User } from 'src/common/decorator/user.decorator';

@ApiTags('User')
@ApiExtraModels(FindUserReqDto, FindUserResDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@User() user: UserAfterAuth) {
    console.log(user);
    const users = await this.userService.findAll();
    return users;
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  async findOne(@Param('id') { id }: FindUserReqDto) {
    return await this.userService.findOne(id);
  }
}
