import { IsString, Length } from 'class-validator';
import { descriptionApiProperty, titleApiProperty } from '../../../decorators/swagger/article-create.input';

export class ArticleInputModel {
  @titleApiProperty()
  @IsString()
  @Length(5, 100)
  title: string;

  @descriptionApiProperty()
  @IsString()
  @Length(5, 1000)
  description: string;
}
