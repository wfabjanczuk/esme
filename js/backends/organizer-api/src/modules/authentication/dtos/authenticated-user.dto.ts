import { PublicUserDto } from '../../users/dtos/public-user.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDto {
  @Expose()
  @Type(() => PublicUserDto)
  user: PublicUserDto;

  @Expose()
  @ApiProperty({
    example:
      'organizer:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTY3MzEyMDcwNCwibmJmIjoxNjczMTIwNzA0LCJleHAiOjE2NzMyMDcxMDQsImF1ZCI6WyJlc21lLmNvbSJdLCJpc3MiOiJlc21lLmNvbSJ9.o1UpdD7RUtI5nUPlIg9db4SK8CJwTrHpL8fKpvVhbGM',
  })
  token: string;
}
