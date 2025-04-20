import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeleteBookingDetailsDto } from 'src/modules/booking-details/dto';
import { CreateBookingDto, UpdateBookingDto } from 'src/modules/bookings/dto';
import { Roles, UserSession } from '../../libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';
import { RoleEnum } from '../users/enums';
import { BookingsService } from './bookings.service';

@UseGuards(JwtAuthGuard, RoleAuthGuard)
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(RoleEnum.USER)
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  async findAll(@UserSession('userId') userId: string) {
    return this.bookingsService.findAll(userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.findOne(id, userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string,
    @Query() deleteBookingDetailsDto?: DeleteBookingDetailsDto,
  ) {
    return this.bookingsService.remove(id, userId, deleteBookingDetailsDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.handleUpdate(updateBookingDto, userId, id);
  }
}
