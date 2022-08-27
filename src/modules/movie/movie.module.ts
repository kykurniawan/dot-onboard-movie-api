import { Module } from '@nestjs/common';
import { MovieService } from './services/movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';
import { TagsExistsValidator } from './validators/tags-exists.validator';
import { MovieSchedule } from './entities/movie-schedule.entity';
import { Studio } from './entities/studio.entity';
import { MovieExistsValidator } from './validators/movie-exists.validator';
import { StudioExistsValidator } from './validators/studio-exitst.validator';
import { UniqueStudioNumberValidator } from './validators/unique-studio-number.validator';
import { MovieScheduleService } from './services/movie-schedule.service';
import { ScheduleExistsValidator } from './validators/schedule-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Tag, MovieSchedule, Studio])],
  exports: [MovieService, MovieScheduleService],
  providers: [
    MovieService,
    MovieScheduleService,
    TagsExistsValidator,
    MovieExistsValidator,
    StudioExistsValidator,
    UniqueStudioNumberValidator,
    ScheduleExistsValidator,
  ],
  controllers: [MovieController],
})
export class MovieModule {}
