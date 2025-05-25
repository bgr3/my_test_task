import { ApiProperty } from '@nestjs/swagger';
import { Paginator } from '../../../../../common/models/paginator';

export class ArticleOutputModel {
  @ApiProperty({ example: '3f232fe0-7c00-4223-acc6-a1ae8385e94a' })
  id: string;
  @ApiProperty({ example: 'В зоопарке впервые родился детеныш панды' })
  title: string;
  @ApiProperty({
    example:
      'Большие панды находятся под угрозой исчезновения в мире в основном из-за потери среды обитания ― бамбуковых лесов, необходимых пандам для питания и проживания',
  })
  description: string;
  @ApiProperty({ example: '2024-08-15T20:12:27.118Z' })
  createdAt: string;
  @ApiProperty({ example: 'HomerSimpson' })
  authorName: string;
}

export class PaginatorArticleOutputModel extends Paginator<ArticleOutputModel> {
  @ApiProperty({
    type: () => [ArticleOutputModel],
  })
  items: ArticleOutputModel[];
}
