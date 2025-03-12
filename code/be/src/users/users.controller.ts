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
import { UsersService } from './users.service';
import { RoleEnum as Role } from '../users/enums/role.enum';

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
