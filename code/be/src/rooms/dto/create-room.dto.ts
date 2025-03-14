import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly roomNumber!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly note?: string;

  @IsUUID()
  @IsNotEmpty()
  readonly roomTypeId!: string;
}
