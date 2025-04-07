import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles, UserSession } from '../../libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';
import { RoleEnum } from '../users/enums';
import { BookingDetailsService } from './booking-details.service';

@UseGuards(JwtAuthGuard, RoleAuthGuard)
@ApiBearerAuth()
@Controller('booking-details')
export class BookingDetailsController {
  constructor(private readonly bookingDetailsService: BookingDetailsService) {}

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
}
