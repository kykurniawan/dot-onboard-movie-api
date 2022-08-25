import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { URLSearchParams } from 'url';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Tag } from './entities/tag.entity';

export class PaginateResult {
  items: Array<Movie>;
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    previous_link: string;
    next_link: string;
  };
}

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

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
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    const updatedMovie = await this.movieRepository.save({
      ...movie,
      ...movieField,
    });
    if (tags) {
      const tagItems: Tag[] = [];

      for (let index = 0; index < tags.length; index++) {
        const tag = await this.findTagById(tags[index]);
        tagItems.push(tag);
      }
      updatedMovie.tags = tagItems;
      await this.movieRepository.save(updatedMovie);
    }
    return updatedMovie;
  }

  async findAllMovie(params?: any): Promise<PaginateResult> {
    const { keyword, date, page, per_page } = params;

    const query = await this.movieRepository.createQueryBuilder('movie');

    if (keyword) {
      await query.where('movie.title LIKE :title', {
        title: '%' + keyword + '%',
      });
      await query.orWhere('movie.overview LIKE :overview', {
        overview: '%' + keyword + '%',
      });
    }

    if (date) {
      await query.where('movie.created_at LIKE :created_at', {
        created_at: '%' + date + '%',
      });
    }

    await query.leftJoinAndSelect('movie.tags', 'tags');

    let paginatePage = 1;
    if (page) {
      paginatePage = Number(page);
    }
    let paginateLimit = 10;
    if (per_page) {
      paginateLimit = Number(per_page);
    }
    const offset = (paginatePage - 1) * paginateLimit;
    const result = await query
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
      console.log(prv);
      delete params.page;
      previous = '?' + new URLSearchParams({ page: prv, ...params }).toString();
    }
    if (paginatePage !== totalPages) {
      const nxt = paginatePage + 1;
      console.log(nxt);
      delete params.page;
      next = '?' + new URLSearchParams({ page: nxt, ...params }).toString();
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
    return await this.movieRepository.findOneBy({ id });
  }

  async createTag(name: string): Promise<Tag> {
    return await this.tagRepository.save({ name });
  }

  async findAllTag(): Promise<Tag[]> {
    return await this.tagRepository.find({});
  }

  async findTagById(id: number): Promise<Tag> {
    return await this.tagRepository.findOneBy({ id });
  }
}
