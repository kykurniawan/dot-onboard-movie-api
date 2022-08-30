import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { NowPlayingMovie } from '../entities/now-playing-movie.entity';

@Injectable()
export class NowPlayingMovieService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(NowPlayingMovie)
    private readonly nowPlayingMovieRepository: Repository<NowPlayingMovie>,
  ) {}

  async findAll(): Promise<NowPlayingMovie[]> {
    return await this.nowPlayingMovieRepository.find();
  }

  async sync(
    nowPlayingMovies: Array<NowPlayingMovie>,
  ): Promise<Array<NowPlayingMovie>> {
    let results = [];
    await this.entityManager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.delete(NowPlayingMovie, {});
        results = await transactionalEntityManager.save(nowPlayingMovies);
      },
    );

    return results;
  }
}
