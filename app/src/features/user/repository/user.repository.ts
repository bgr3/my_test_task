import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async save(user: User): Promise<string> {
    const userResult = await this.usersRepository.save(user);
    return userResult.id;
  }

  async findUserByName({ name }: { name: string }): Promise<User | null> {
    const user = this.usersRepository.findOne({ where: { login: name } });
    return user;
  }

  async findUserById({ userId }: { userId: string }): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    return user;
  }
}
