import * as process from 'process';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { NowPlayingMovieService } from '../movie/services/now-playing-movie.service';
import { NowPlayingMovie } from '../movie/entities/now-playing-movie.entity';

interface MovieItem {
  id: number;
  backdrop_path: string;
  genre_ids: Array<number>;
  adult: boolean;
  original_language: string;
  title: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  private readonly apiUrl = 'https://api.themoviedb.org/3';

  constructor(
    private readonly httpService: HttpService,
    private readonly nowPlayingMovieService: NowPlayingMovieService,
  ) {}

  @Cron('* * * * *')
  async getCurrentlyPlayingMovie() {
    const movies = await this.getMovieFromApi();
    const convertedMovies = movies.map((item: MovieItem) => {
      const convertedMovie = new NowPlayingMovie();
      convertedMovie.title = item.title;
      convertedMovie.overview = item.overview;
      convertedMovie.release_date = new Date(item.release_date);
      return convertedMovie;
    });

    await this.nowPlayingMovieService.sync(convertedMovies);
    this.logger.log('Now playing movie sync success');
  }

  private async getMovieFromApi(): Promise<Array<MovieItem>> {
    const query = new URLSearchParams({
      api_key: process.env.TMDB_APIKEY,
      language: 'en-US',
      page: '1',
    });
    const url = this.apiUrl + '/movie/now_playing?' + query;

    const response = await this.httpService.axiosRef.get(url);
    if (response.status != 200) {
      return [];
    }
    return response.data.results as Array<MovieItem>;
  }
}
