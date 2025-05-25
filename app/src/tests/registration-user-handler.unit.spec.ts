import { plainToInstance } from 'class-transformer';
import { argon2Adapter } from '../common/utils/argon2.adapter';
import { BadRequestError, InternalServerError } from '../common/utils/result/custom-error';
import {
  RegistrationUserHandler,
  RegistrationUserCommand,
} from '../features/user/application/commands/registration-user.command';
import { User } from '../features/user/domain/user.entity';
import { UserRepository } from '../features/user/repository/user.repository';

jest.mock('../common/utils/argon2.adapter');

describe('RegistrationUserHandler', () => {
  let handler: RegistrationUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findUserByName: jest.fn(),
      save: jest.fn(),
    } as any;

    handler = new RegistrationUserHandler(userRepository);
  });

  it('should return error if passwords do not match', async () => {
    const command = new RegistrationUserCommand({
      password: '123456',
      passwordConfirmation: 'different',
      userName: 'testuser',
    });

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(BadRequestError);
    expect(result.error._fields[0].field).toBe('passwordConfirmation');
  });

  it('should return error if user already exists', async () => {
    userRepository.findUserByName.mockResolvedValue(
      plainToInstance(User, {
        id: '123',
        createdAt: new Date(),
        login: 'existinguser',
        passwordHash: 'hashed-password',
      }),
    ); // simulate user found

    const command = new RegistrationUserCommand({
      password: '123456',
      passwordConfirmation: '123456',
      userName: 'existinguser',
    });

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(BadRequestError);
    expect(result.error._fields[0].field).toBe('userName');
  });

  it('should return success if user is registered', async () => {
    userRepository.findUserByName.mockResolvedValue(null); // simulate user not found
    (argon2Adapter.createHashFromPassword as jest.Mock).mockResolvedValue('hashed-password');
    userRepository.save.mockResolvedValue('ok');

    const command = new RegistrationUserCommand({
      password: '123456',
      passwordConfirmation: '123456',
      userName: 'newuser',
    });

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(true);
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
  });

  it('should return internal error if exception occurs', async () => {
    userRepository.findUserByName.mockRejectedValue(new Error('DB failure')); // simulate error in db

    const command = new RegistrationUserCommand({
      password: '123456',
      passwordConfirmation: '123456',
      userName: 'newuser',
    });

    const result = await handler.execute(command);

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeInstanceOf(InternalServerError);
  });
});
