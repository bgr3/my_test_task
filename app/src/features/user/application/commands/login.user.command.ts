import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { JwtAdapter } from '../../../../common/utils/jwt.adapter';
import { ObjResult } from '../../../../common/utils/result/object-result';

export class LoginUserCommand {
  constructor(public inputModel: { userId: string }) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(private readonly jwtAdapter: JwtAdapter) {}
  async execute(command: LoginUserCommand): Promise<ObjResult<{ accessToken: string }>> {
    const accessToken = await this.jwtAdapter.createAccessToken({
      userId: command.inputModel.userId,
    });

    return ObjResult.Ok({ accessToken });
  }
}
