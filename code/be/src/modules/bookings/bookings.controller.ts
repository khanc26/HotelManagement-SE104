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
import { BookingsService } from './bookings.service';
import { Roles, UserSession } from '../../libs/common/decorators';
import { RoleEnum } from '../users/enums';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';

@UseGuards(JwtAuthGuard, RoleAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post()
  async create(
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
  async findOne(@Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string) {
    return this.bookingsService.findOne(id, userId);
  }

  // just update totalPrice and status
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.update(id, updateBookingDto, userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.remove(id, userId);
  }
}
