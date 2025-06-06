// import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

// export class UpdateBookingDto {
//   @ApiProperty({ type: [UpdateBookingDetailDto] })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateNested({ each: true })
//   @Type(() => UpdateBookingDetailDto)
//   readonly updateBookingDetailDtos!: UpdateBookingDetailDto[];
// }
