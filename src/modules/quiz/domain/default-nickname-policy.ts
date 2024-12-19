// src/user/domain/default-nickname-policy.ts

import { v4 as uuidv4 } from 'uuid';

export class DefaultNicknamePolicy {
  private static readonly RANDOM_LENGTH = 8;
  private static readonly PREFIX = 'MATE';

  // 랜덤 닉네임 생성 메서드
  public static generateRandomString(): string {
    const randomString = this.generateSubStringUUID();
    return this.PREFIX + randomString;
  }

  // UUID 기반 서브스트링 생성 메서드
  private static generateSubStringUUID(): string {
    return uuidv4().replace(/-/g, '').substring(0, this.RANDOM_LENGTH);
  }
}
