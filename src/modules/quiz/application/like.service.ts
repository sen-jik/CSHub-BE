import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../infrastructure/db/entity/like.entity';
import { LikeTargetType, ToggleLikeReqDto } from '../dto/like.req.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async findOne(id: number, userId: number) {
    return await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        interview: { id },
      },
    });
  }

  async toggleLike(
    userId: number,
    params: ToggleLikeReqDto,
  ): Promise<{ isLiked: boolean }> {
    return await this.likeRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const { type, targetId } = params;
        const isInterview = type === LikeTargetType.INTERVIEW;
        const targetEntity = isInterview ? 'interview' : 'quiz';

        const whereCondition = {
          user: { id: userId },
          [targetEntity]: { id: targetId },
        };

        const existingLike = await transactionalEntityManager
          .getRepository(Like)
          .createQueryBuilder('like')
          .setLock('pessimistic_write')
          .where(whereCondition)
          .getOne();

        if (existingLike) {
          await transactionalEntityManager.remove(existingLike);
          return { isLiked: false };
        }

        const newLike = transactionalEntityManager.create(Like, {
          user: { id: userId },
          [targetEntity]: { id: targetId },
          [isInterview ? 'quiz' : 'interview']: null,
        });

        await transactionalEntityManager.save(newLike);
        return { isLiked: true };
      },
    );
  }
}
