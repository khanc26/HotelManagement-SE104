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
import { Roles } from 'src/libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import {
  CreateRoomDto,
  SearchRoomsDto,
  SearchStatusRoomsDto,
  UpdateRoomDto,
} from 'src/modules/rooms/dto';
import { RoleEnum } from 'src/modules/users/enums';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  async findAll(@Query() searchRoomsDto?: SearchRoomsDto) {
    return this.roomsService.findAll(searchRoomsDto);
  }

  @Get('percentage-by-status')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async getPercentsByStatusGroupByRoomTypes(
    @Query() { status }: SearchStatusRoomsDto,
  ) {
    return this.roomsService.handleGetRoomStatusPercentageByType(status);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.SUPER_ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.removeRoom(id);
  }
}
