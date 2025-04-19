import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class LockAccountDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  readonly userIds!: string[];
}
