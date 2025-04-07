import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import { Roles } from 'src/libs/common/decorators';
import { RoleEnum as Role } from './enums/role.enum';
import { UsersService } from './users.service';
import { SearchUsersDto, UpdateUserDto } from 'src/modules/users/dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Query() searchUsersDto?: SearchUsersDto) {
    return this.usersService.findAll(searchUsersDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.handleDeleteUser(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  async updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.handleUpdateUser(id, updateUserDto);
  }
}
