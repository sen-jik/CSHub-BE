import { v4 as uuidv4 } from 'uuid';

export class DefaultNicknamePolicy {
  private static readonly RANDOM_LENGTH = 8;
  private static readonly PREFIX = 'MATE';

  public static generateRandomString(): string {
    const randomString = this.generateSubStringUUID();
    return this.PREFIX + randomString;
  }
  private static generateSubStringUUID(): string {
    return uuidv4().replace(/-/g, '').substring(0, this.RANDOM_LENGTH);
  }
}
