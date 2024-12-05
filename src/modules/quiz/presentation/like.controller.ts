import {
  Controller,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LikeService } from '../application/like.service';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { ToggleLikeResDto } from '../dto/like.res.dto';
import { LikeTargetType, ToggleLikeReqDto } from '../dto/like.req.dto';

@ApiTags('Like')
@ApiExtraModels(ToggleLikeResDto, ToggleLikeReqDto)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':type/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiPostResponse(ToggleLikeResDto)
  async toggleLike(
    @User() user: UserAfterAuth,
    @Param('type') type: LikeTargetType,
    @Param('id', ParseIntPipe) targetId: number,
  ): Promise<ToggleLikeResDto> {
    const params: ToggleLikeReqDto = {
      type,
      targetId,
    };
    return this.likeService.toggleLike(user.id, params);
  }
}
