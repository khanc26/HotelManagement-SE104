import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RoleAuthGuard } from '../../libs/common/guards';
import { Roles } from '../../libs/common/decorators';
import { RoleEnum } from '../users/enums';
import { UpdateParamDto } from './dto';
import { ParamsService } from './params.service';

@Controller('params')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
export class ParamsController {
  constructor(private readonly paramsService: ParamsService) {}

  @Get()
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  async getAllParams() {
    return this.paramsService.getAllParams();
  }

  @Put(':paramName')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  async updateParam(
    @Param('paramName') paramName: string,
    @Body() updateParamDto: UpdateParamDto,
  ) {
    return this.paramsService.updateParam(paramName, updateParamDto);
  }
}
