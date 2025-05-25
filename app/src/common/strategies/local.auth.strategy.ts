import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UserRepository } from '../../features/user/repository/user.repository';
import { argon2Adapter } from '../utils/argon2.adapter';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      usernameField: 'userName',
    });
  }

  async validate(userName: string, password: string) {
    if (typeof userName !== 'string' || typeof password !== 'string') {
      return null;
    }

    const user = await this.userRepository.findUserByName({ name: userName });

    if (!user) {
      return null;
    }

    const isMatch = await argon2Adapter.validateHash(user!.passwordHash, password);

    if (!isMatch) {
      return null;
    }

    return { userId: user.id };
  }
}
