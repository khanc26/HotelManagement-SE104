import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { Roles, UserSession } from '../../libs/common/decorators';
import { RoleEnum } from '../users/enums';
import { CreateBookingDetailDto, UpdateBookingDetailDto } from './dto';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';

@UseGuards(JwtAuthGuard, RoleAuthGuard)
@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) {}

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post(':bookingId')
  async create(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() createBookingDetailDto: CreateBookingDetailDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingDetailsService.create(
      bookingId,
      createBookingDetailDto,
      userId,
    );
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  async findAll(@UserSession('userId') userId: string) {
    return this.bookingDetailsService.findAll(userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingDetailsService.findOne(id, userId);
  }

  // just update totalPrice and status
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDetailDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingDetailsService.update(id, updateBookingDto, userId);
  }

  // @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  // @Delete(':id')
  // async remove(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @UserSession('userId') userId: string,
  // ) {
  //   return this.bookingDetailsService.remove(id, userId);
  // }
}
