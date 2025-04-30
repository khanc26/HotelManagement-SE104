import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';
import { Roles } from '../../libs/common/decorators';
import { RoleEnum } from '../users/enums';
import { UpdateConfigurationDto } from './dto';

@Controller('configurations')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  async getAllConfigurations() {
    return this.configurationsService.getAllConfigurations();
  }

  @Put(':configName')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  async updateConfiguration(
    @Param('configName') configName: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    return this.configurationsService.updateConfiguration(
      configName,
      updateConfigurationDto,
    );
  }
}
