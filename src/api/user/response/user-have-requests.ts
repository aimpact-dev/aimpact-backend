import { ApiProperty } from '@nestjs/swagger';

export class UserHaveRequests {
  @ApiProperty({
    description: 'Is user have free messages reuqest',
  })
  userHaveRequest: boolean;
}
