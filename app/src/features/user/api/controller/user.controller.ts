import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { RegistrationUserInputModel } from '../dto/input/user-registration.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationUserCommand } from '../../application/commands/registration-user.command';
import { UserRegistrationOutputModel } from '../dto/output/registratio.output.dto';
import { AccessTokenOutputModel } from '../dto/output/login.output.dto';
import { UserIdFromRequest } from '../../decorators/swagger/userIdFromRequest';
import { LocalAuthGuard } from '../../../../common/guards/local.auth.guard';
import { LoginUserCommand } from '../../application/commands/login.user.command';
import { LoginSwagger } from '../../decorators/swagger/login.swagger.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserSwagger } from '../../decorators/swagger/create-user.swagger.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('registration')
  @CreateUserSwagger()
  async registration(@Body() dto: RegistrationUserInputModel): Promise<UserRegistrationOutputModel> {
    const result = await this.commandBus.execute(new RegistrationUserCommand(dto));

    if (!result.isSuccess) throw result.error;

    return { userName: dto.userName };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @LoginSwagger()
  async login(@UserIdFromRequest() userInfo: { userId: string }): Promise<AccessTokenOutputModel> {
    const result = await this.commandBus.execute(new LoginUserCommand({ userId: userInfo.userId }));

    if (!result.isSuccess) throw result.error;

    return { accessToken: result.value.accessToken };
  }
}
