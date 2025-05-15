import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import { SearchMonthlyRevenueDto } from 'src/modules/reports/dto';
import { RoleEnum } from 'src/modules/users/enums';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getMonthlyRevenue(
    @Query() searchMonthlyRevenueDto?: SearchMonthlyRevenueDto,
  ) {
    return this.reportsService.handleGetMonthlyRevenue(searchMonthlyRevenueDto);
  }

  @Get(':id')
  async getMonthlyRevenueDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.handleGetMonthlyRevenueDetails(id);
  }
}
