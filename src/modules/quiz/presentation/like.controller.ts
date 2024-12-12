import {
  Controller,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { LikeService } from '../application/like.service';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { LikeTargetType, ToggleLikeReqDto } from '../dto/like.req.dto';

@ApiTags('Like')
@ApiExtraModels(ToggleLikeReqDto)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':type/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async toggleLike(
    @User() user: UserAfterAuth,
    @Param('type') type: LikeTargetType,
    @Param('id', ParseIntPipe) targetId: number,
  ): Promise<void> {
    const params: ToggleLikeReqDto = {
      type,
      targetId,
    };
    await this.likeService.toggleLike(user.id, params);
  }
}
