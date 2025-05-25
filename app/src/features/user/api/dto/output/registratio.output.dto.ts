import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationOutputModel {
  @ApiProperty({ example: 'HomerSimpson' })
  userName: string;
}
