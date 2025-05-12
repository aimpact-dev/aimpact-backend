import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  @Public()
  @Get('publicTest')
  async findByIdPublic(@Query('id') id: string) {
    return await this.usersService.findById(+id);
  }

  @Get('privateTest')
  async findByIdAuth(@Query('id') id: string) {
    return await this.usersService.findById(+id);
  }
}
