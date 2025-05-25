import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/domain/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ collation: 'C' })
  title: string;

  @Column({ collation: 'C' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.article, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
  @Column()
  userId: string;

  updateArticle({ title, description }: { title: string; description: string }) {
    this.title = title;
    this.description = description;
  }

  static createArticle({ title, description, user }: { title: string; description: string; user: User }): Article {
    const article = new this();

    article.title = title;
    article.description = description;
    article.user = user;

    return article;
  }
}
