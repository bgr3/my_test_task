import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../article/domain/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ collation: 'C' })
  login: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Article, (article) => article.user, {})
  article: Article;

  static createUser({ login, passwordHash }: { login: string; passwordHash: string }): User {
    const user = new this();

    user.login = login;
    user.passwordHash = passwordHash;

    return user;
  }
}
