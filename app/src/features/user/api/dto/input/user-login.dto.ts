import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/trim.decorator';
import { passwordApiProperty, userNameApiProperty } from '../../../decorators/swagger/user-registration.input';

export class LoginUserInputModel {
  @userNameApiProperty()
  @IsString()
  @Trim()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  userName: string;

  @passwordApiProperty()
  @IsString()
  @Trim()
  @Length(6, 20)
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!\"#$%&'()*+,\-.\/:\;<=>?@\[\\\]^_`{|}~]).*$/)
  @IsNotEmpty()
  password: string;
}
