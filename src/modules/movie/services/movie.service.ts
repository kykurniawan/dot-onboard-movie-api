import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { URLSearchParams } from 'url';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Movie } from '../entities/movie.entity';
import { Tag } from '../entities/tag.entity';
import { PaginateResult } from '../interfaces/paginate-result.interface';

@Injectable()
export class MovieService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async insertMovie(movies: Movie[]) {
    await this.movieRepository.save(movies);
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { title, overview, play_until, poster, tags } = createMovieDto;

    const tagItems: Tag[] = [];

    for (let index = 0; index < tags.length; index++) {
      const tag = await this.findTagById(tags[index]);
      tagItems.push(tag);
    }

    const movie = new Movie();
    movie.title = title;
    movie.overview = overview;
    movie.play_until = play_until;
    movie.poster = poster;
    movie.tags = tagItems;

    return await this.movieRepository.save(movie);
  }

  async updateMovie(
    movieId: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    const { tags, ...movieField } = updateMovieDto;
    let movie = await this.movieRepository.findOneBy({ id: movieId });
    await this.entityManager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        movie = await transactionalEntityManager.save({
          ...movie,
          ...movieField,
        });
        if (tags) {
          const tagItems: Tag[] = [];

          for (let index = 0; index < tags.length; index++) {
            const tag = await this.findTagById(tags[index]);
            tagItems.push(tag);
          }
          movie.tags = tagItems;
          await transactionalEntityManager.save(movie);
        }
      },
    );
    return movie;
  }

  async findAllMovie(query?: any): Promise<PaginateResult> {
    const { keyword, date, page, per_page } = query;

    const queryBuilder = await this.movieRepository.createQueryBuilder('movie');

    if (keyword) {
      await queryBuilder.where('movie.title LIKE :title', {
        title: '%' + keyword + '%',
      });
      await queryBuilder.orWhere('movie.overview LIKE :overview', {
        overview: '%' + keyword + '%',
      });
    }

    if (date) {
      await queryBuilder.where('movie.created_at LIKE :created_at', {
        created_at: '%' + date + '%',
      });
    }

    await queryBuilder.leftJoinAndSelect('movie.tags', 'tags');

    let paginatePage = 1;
    if (page) {
      paginatePage = Number(page);
    }
    let paginateLimit = 10;
    if (per_page) {
      paginateLimit = Number(per_page);
    }
    const offset = (paginatePage - 1) * paginateLimit;
    const result = await queryBuilder
      .limit(paginateLimit)
      .offset(offset)
      .getManyAndCount();

    const items = result[0];
    const totalItems = result[1];
    const totalPages = Math.ceil(result[1] / paginateLimit);
    let previous: string = null;
    let next: string = null;
    if (paginatePage !== 1) {
      const prv = paginatePage - 1;
      delete query.page;
      previous = '?' + new URLSearchParams({ page: prv, ...query }).toString();
    }
    if (paginatePage !== totalPages) {
      const nxt = paginatePage + 1;
      delete query.page;
      next = '?' + new URLSearchParams({ page: nxt, ...query }).toString();
    }

    return {
      items: items,
      pagination: {
        page: paginatePage,
        per_page: paginateLimit,
        total_items: totalItems,
        total_pages: totalPages,
        previous_link: previous,
        next_link: next,
      },
    };
  }

  async findMovieById(id: number): Promise<Movie> {
    return await this.movieRepository.findOne({
      where: { id },
      relations: {
        schedules: true,
      },
    });
  }

  async createTag(name: string): Promise<Tag> {
    return await this.tagRepository.save({ name });
  }

  async findAllTag(query?: any): Promise<PaginateResult> {
    const { page, per_page } = query;
    let paginatePage = 1;
    if (page) {
      paginatePage = Number(page);
    }
    let paginateLimit = 10;
    if (per_page) {
      paginateLimit = Number(per_page);
    }
    const offset = (paginatePage - 1) * paginateLimit;
    const result = await this.tagRepository.findAndCount({
      take: paginateLimit,
      skip: offset,
      relations: {
        movies: true,
      },
    });

    const items = result[0];
    const totalItems = result[1];
    const totalPages = Math.ceil(result[1] / paginateLimit);
    let previous: string = null;
    let next: string = null;
    if (paginatePage !== 1) {
      const prv = paginatePage - 1;
      delete query.page;
      previous = '?' + new URLSearchParams({ page: prv, ...query }).toString();
    }
    if (paginatePage !== totalPages) {
      const nxt = paginatePage + 1;
      delete query.page;
      next = '?' + new URLSearchParams({ page: nxt, ...query }).toString();
    }

    return {
      items: items,
      pagination: {
        page: paginatePage,
        per_page: paginateLimit,
        total_items: totalItems,
        total_pages: totalPages,
        previous_link: previous,
        next_link: next,
      },
    };
  }

  async findTagById(id: number): Promise<Tag> {
    return await this.tagRepository.findOneBy({ id });
  }
}
