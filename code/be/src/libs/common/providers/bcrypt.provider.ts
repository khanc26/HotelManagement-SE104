import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { HashingProvider } from 'src/libs/common/providers';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(password: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
  }
  async comparePassword(
    password: string | Buffer,
    hash: string,
  ): Promise<boolean> {
    return compare(password, hash);
  }
}
