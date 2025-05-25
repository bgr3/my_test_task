import { Module } from '@nestjs/common';
import { UserController } from './api/controller/user.controller';
import { RegistrationUserHandler } from './application/commands/registration-user.command';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { LoginUserHandler } from './application/commands/login.user.command';
import { JwtAdapter } from '../../common/utils/jwt.adapter';
import { JwtModule } from '@nestjs/jwt';
import { AppCoreModule } from '../../common/settings/core/app.core.module';
import { LocalStrategy } from '../../common/strategies/local.auth.strategy';

const handlers = [RegistrationUserHandler, LoginUserHandler];

@Module({
  imports: [AppCoreModule, JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserRepository, JwtAdapter, LocalStrategy, ...handlers],
})
export class UserModule {}
