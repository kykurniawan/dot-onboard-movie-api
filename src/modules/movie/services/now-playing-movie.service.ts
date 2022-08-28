import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NowPlayingMovie } from '../entities/now-playing-movie.entity';

@Injectable()
export class NowPlayingMovieService {
  constructor(
    @InjectRepository(NowPlayingMovie)
    private readonly nowPlayingMovieRepository: Repository<NowPlayingMovie>,
  ) {}

  async findAll(): Promise<NowPlayingMovie[]> {
    return await this.nowPlayingMovieRepository.find();
  }

  async sync(
    nowPlayingMovies: Array<NowPlayingMovie>,
  ): Promise<Array<NowPlayingMovie>> {
    await this.nowPlayingMovieRepository.delete({});
    return await this.nowPlayingMovieRepository.save(nowPlayingMovies);
  }
}
