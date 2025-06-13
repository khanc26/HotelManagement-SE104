import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Roles, UserSession } from 'src/libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import { RoleEnum } from 'src/modules/users/enums';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // @Get()
  // @UseGuards(JwtAuthGuard, RoleAuthGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  // async getAll(
  //   @UserSession('role') role: string,
  //   @UserSession('userId') userId: string,
  // ) {
  //   return this.invoicesService.handleGetInvoices(role, userId);
  // }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard, RoleAuthGuard)
  // @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  // async getOne(
  //   @UserSession('role') role: string,
  //   @UserSession('userId') userId: string,
  //   @Param('id', ParseUUIDPipe) id: string,
  // ) {
  //   return this.invoicesService.handleGetInvoice(role, userId, id);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard, RoleAuthGuard)
  // @Roles(RoleEnum.ADMIN)
  // async deleteOne(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.invoicesService.handleDeleteInvoice(id);
  // }
}
