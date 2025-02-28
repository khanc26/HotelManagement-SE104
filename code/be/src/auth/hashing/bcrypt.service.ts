import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
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
