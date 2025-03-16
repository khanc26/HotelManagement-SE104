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
import { JwtAuthGuard, RoleAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/libs/common/decorators';
import { SearchUsersDto } from 'src/users/dto/search-users.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { RoleEnum as Role } from '../users/enums/role.enum';
import { UsersService } from './users.service';

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
