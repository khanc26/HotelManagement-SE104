// import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
// import { CreateBookingDetailDto } from 'src/modules/booking-details/dto';

// export class CreateBookingDto {
//   @ApiProperty({ type: [CreateBookingDetailDto] })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateNested({ each: true })
//   @Type(() => CreateBookingDetailDto)
//   readonly createBookingDetailDtos!: CreateBookingDetailDto[];
// }
