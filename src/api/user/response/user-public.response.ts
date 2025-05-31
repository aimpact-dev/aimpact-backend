import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entities/user.entity";

export type PublicUser = {
  id: string;
  wallet: string;
}

export class UserPublicResponse {
  @ApiProperty()
  id: string

  @ApiProperty()
  wallet: string;

  static fromEntity(user: User): UserPublicResponse {
    return Object.assign(new UserPublicResponse(), {
      id: user.id,
      wallet: user.wallet,
    })
  }
}
