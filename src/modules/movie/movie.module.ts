import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { TagsExistsValidator } from './validators/tags-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Tag])],
  exports: [MovieService],
  providers: [MovieService, TagsExistsValidator],
  controllers: [MovieController],
})
export class MovieModule {}
