import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/decorator/public.decorator';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Public()
  @Get('publicTest')
  async findByIdPublic(@Query('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Get('privateTest')
  async findByIdAuth(@Query('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Post('request-messages')
  @ApiOperation({
    summary: "Request few free messages (can be used only once)"
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Messages claimed",
  })
  @ApiResponse({
    status: 400,
    description: "You already claimed messages or total limit reached"
  })
  async requestFreeMessages(@ApiContext() user: User) {
    return await this.usersService.requestFreeMessages(user);
  }
}
