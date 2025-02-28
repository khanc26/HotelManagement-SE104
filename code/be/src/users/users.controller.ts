import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RoleAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/libs/common/decorators';
import { Role } from 'src/users/enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.handleDeleteUser(id);
  }
}
