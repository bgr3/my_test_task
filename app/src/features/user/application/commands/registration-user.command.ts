import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { argon2Adapter } from '../../../../common/utils/argon2.adapter';
import { RegistrationUserInputModel } from '../../api/dto/input/user-registration.dto';
import { ObjResult } from '../../../../common/utils/result/object-result';
import { BadRequestError, InternalServerError } from '../../../../common/utils/result/custom-error';
import { UserRepository } from '../../repository/user.repository';
import { User } from '../../domain/user.entity';

export class RegistrationUserCommand {
  constructor(public inputModel: RegistrationUserInputModel) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserHandler implements ICommandHandler<RegistrationUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: RegistrationUserCommand): Promise<any> {
    const { password, passwordConfirmation, userName } = command.inputModel;
    try {
      //проверка совпадения паролей
      const passwordCheck = this.checkPasswordMatch(password, passwordConfirmation);
      if (passwordCheck) return passwordCheck;

      //проверка свободно ли имя
      const existCheck = await this.checkAvailability(userName);
      if (existCheck) return existCheck;

      const passwordHash = await argon2Adapter.createHashFromPassword(password);

      const newUser = User.createUser({
        login: userName,
        passwordHash,
      });

      await this.userRepository.save(newUser);

      return ObjResult.Ok();
    } catch (e) {
      return ObjResult.Err(new InternalServerError('Internal server error'));
    }
  }

  private checkPasswordMatch(password: string, passwordConfirmation: string) {
    if (password !== passwordConfirmation) {
      return this.createError('Passwords must match', 'Passwords must match', 'passwordConfirmation');
    }
  }

  private async checkAvailability(userName: string) {
    const user = await this.userRepository.findUserByName({ name: userName });

    if (user) {
      return this.createError(
        'User with this user name is already registered',
        'User with this user name is already registered',
        'userName',
      );
    }
  }

  private createError(title: string, message: string, field: string) {
    return ObjResult.Err(new BadRequestError(title, [{ message, field }]));
  }
}
