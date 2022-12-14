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
import { NowPlayingMovie } from './entities/now-playing-movie.entity';
import { NowPlayingMovieService } from './services/now-playing-movie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movie,
      Tag,
      MovieSchedule,
      Studio,
      NowPlayingMovie,
    ]),
  ],
  exports: [MovieService, MovieScheduleService, NowPlayingMovieService],
  providers: [
    MovieService,
    MovieScheduleService,
    NowPlayingMovieService,
    TagsExistsValidator,
    MovieExistsValidator,
    StudioExistsValidator,
    UniqueStudioNumberValidator,
    ScheduleExistsValidator,
  ],
  controllers: [MovieController],
})
export class MovieModule {}
