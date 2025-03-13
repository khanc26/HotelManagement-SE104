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
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';
import { SearchRoomsDto } from 'src/rooms/dto/search-rooms.dto';
import { JwtAuthGuard, RoleAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/libs/common/decorators';
import { RoleEnum } from 'src/users/enums/role.enum';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  async findAll(@Query() searchRoomsDto?: SearchRoomsDto) {
    return this.roomsService.findAll(searchRoomsDto);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomsService.removeRoom(id);
  }
}
