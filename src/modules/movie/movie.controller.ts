import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseFilters,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpExceptionFilter } from '../../app.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MovieService } from './services/movie.service';
import { NowPlayingMovieService } from './services/now-playing-movie.service';
import { CacheKey } from '@nestjs/common/cache';
import { MOVIE_CACHE_KEY } from '../../app.constant';
import { HttpCacheInterceptor } from '../../app.interceptor';

@Controller('movies')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheKey(MOVIE_CACHE_KEY)
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly nowPlayingMovieService: NowPlayingMovieService,
  ) {}

  @Get()
  async movieList(@Req() req: Request) {
    const result = await this.movieService.findAllMovie(req.query);
    return {
      success: true,
      message: 'ok',
      data: result,
    };
  }

  @Get('now-playing')
  async nowPlaying() {
    const movies = await this.nowPlayingMovieService.findAll();
    return {
      success: true,
      message: 'now playing movie from tmdb',
      data: {
        items: movies,
      },
    };
  }

  @Get(':id')
  async detailMovie(@Req() req: Request) {
    const movie = await this.movieService.findMovieById(Number(req.params.id));

    if (!movie) {
      throw new NotFoundException();
    }
    return {
      success: true,
      message: 'ok',
      data: {
        item: movie,
      },
    };
  }
}
