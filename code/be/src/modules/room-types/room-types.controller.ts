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
import { RoomTypesService } from './room-types.service';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import { Roles } from 'src/libs/common/decorators';
import { RoleEnum } from 'src/modules/users/enums';
import {
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
} from 'src/modules/room-types/dto';

@Controller('room-types')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Post()
  create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypesService.create(createRoomTypeDto);
  }

  @Get()
  findAll() {
    return this.roomTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomTypesService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomTypesService.remove(id);
  }
}
