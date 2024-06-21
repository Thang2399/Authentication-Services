import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserServices } from '@/src/module/user/service/user.service';
import { AuthenticationGuard } from '@/src/shared/guard/auth.guard';
import { Response } from 'express';
import { UpdateUserDto } from '@/src/dto/user/update-user.dto';
import { UpdateUserRoleDto } from '@/src/dto/user/update-user-role.dto';
import { UpdateUserPasswordDto } from '@/src/dto/user/update-user-password.dto';

@ApiTags('User API')
@UseGuards(AuthenticationGuard)
@Controller('/users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userServices: UserServices) {}
  @ApiOperation({
    description: 'Get user information by User Id',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @Get('/:id')
  async getDetailUserInformation(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.userServices.getDetailUserInformation(id, res);
  }

  @ApiOperation({
    description: 'Update user information',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({
    type: UpdateUserDto,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Put('/:id')
  async updateUserInformation(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return await this.userServices.updateUserInformation(id, dto, res);
  }

  @ApiOperation({
    description: 'Update user role',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({
    type: UpdateUserRoleDto,
  })
  @Put('/user-role/:id')
  async updateUserRoleInformation(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @Res() res: Response,
  ) {
    return await this.userServices.updateUserRoleInformation(id, dto, res);
  }

  @ApiOperation({
    description: 'Change user password',
  })
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/change-password')
  async updateUserPassword(
    @Body() dto: UpdateUserPasswordDto,
    @Res() res: Response,
  ) {
    return await this.userServices.updateUserPassword(dto, res);
  }
}
