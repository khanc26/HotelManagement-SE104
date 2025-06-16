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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, UserSession } from '../../libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';
import { RoleEnum } from '../users/enums';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto';

@ApiTags('Bookings')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  @Get()
  async findAll(@UserSession('userId') userId: string) {
    return this.bookingsService.findAll(userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.findOne(id, userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.remove(id, userId);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @UserSession('userId') userId: string,
  ) {
    return this.bookingsService.update(id, updateBookingDto, userId);
  }
}
