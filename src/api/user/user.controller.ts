import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/decorator/public.decorator';
import { ApiContext } from '../auth/decorator/api-context.decorator';
import { User } from 'src/entities/user.entity';

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
  async requestFreeMessages(@ApiContext() user: User) {
    return await this.usersService.requestFreeMessages(user);
  }
}
