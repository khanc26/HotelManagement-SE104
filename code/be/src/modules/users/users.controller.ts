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
import { Roles, UserSession } from 'src/libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import {
  AssignRoleDto,
  LockAccountDto,
  RevokeRoleDto,
  SearchUsersDto,
  UnlockAccountDto,
  UpdateUserDto,
} from 'src/modules/users/dto';
import { RoleEnum as Role, RoleEnum } from './enums/role.enum';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(
    @UserSession('role') role: string,
    @Query() searchUsersDto?: SearchUsersDto,
  ) {
    return this.usersService.findAll(role, searchUsersDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async deleteOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserSession('role') role: string,
  ) {
    return this.usersService.handleDeleteUser(id, role);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  async updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.handleUpdateUser(id, updateUserDto);
  }

  @Post('assign-role')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async assignRoleToUsers(
    @Body() assignRoleDto: AssignRoleDto,
    @UserSession('role') role: string,
  ) {
    return this.usersService.handleAssignRoleToUsers(assignRoleDto, role);
  }

  @Post('revoke-role')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.SUPER_ADMIN)
  async revokeRoleToUsers(
    @Body() revokeRoleDto: RevokeRoleDto,
    @UserSession('role') role: string,
  ) {
    return this.usersService.handleRevokeRoleToUsers(revokeRoleDto, role);
  }

  @Post('lock-account')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async lockUser(
    @Body() lockAccountDto: LockAccountDto,
    @UserSession('role') role: RoleEnum,
  ) {
    return this.usersService.handleLockUser(lockAccountDto, role);
  }

  @Post('unlock-account')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async unlockUser(
    @Body() unlockAccountDto: UnlockAccountDto,
    @UserSession('role') role: RoleEnum,
  ) {
    return this.usersService.handleUnlockUser(unlockAccountDto, role);
  }
}
