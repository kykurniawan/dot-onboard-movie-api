import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateMovieScheduleDto } from '../dto/create-movie-schedule.dto';
import { MovieSchedule } from '../entities/movie-schedule.entity';
import { Studio } from '../entities/studio.entity';
import { PaginateResult } from '../interfaces/paginate-result.interface';
import { MovieService } from './movie.service';

@Injectable()
export class MovieScheduleService {
  constructor(
    @InjectRepository(MovieSchedule)
    private readonly movieScheduleRepository: Repository<MovieSchedule>,
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    private readonly movieService: MovieService,
  ) {}

  async createStudio(
    studio_number: number,
    seat_capacity: number,
  ): Promise<Studio> {
    return await this.studioRepository.save({
      studio_number,
      seat_capacity,
    });
  }

  async findAllStudio(): Promise<Studio[]> {
    return await this.studioRepository.find({
      relations: {
        schedules: true,
      },
    });
  }

  async findOneStudio(id: number): Promise<Studio> {
    return await this.studioRepository.findOne({
      where: { id },
      relations: { schedules: true },
    });
  }

  async findOneStudioByStudioNumber(studio_number: number): Promise<Studio> {
    return await this.studioRepository.findOne({
      where: { studio_number },
      relations: { schedules: true },
    });
  }

  async deleteStudio(id: number): Promise<DeleteResult> {
    return await this.studioRepository.delete({ id });
  }

  async updateStudio(
    id: number,
    data: QueryDeepPartialEntity<Studio>,
  ): Promise<UpdateResult> {
    return await this.studioRepository.update({ id }, data);
  }

  async createSchedule(
    movieScheduleDto: CreateMovieScheduleDto,
  ): Promise<MovieSchedule> {
    const movie = await this.movieService.findMovieById(
      movieScheduleDto.movie_id,
    );
    const studio = await this.findOneStudio(movieScheduleDto.studio_id);

    const schedule = new MovieSchedule();
    schedule.movie = movie;
    schedule.studio = studio;
    schedule.price = movieScheduleDto.price;
    schedule.start_time = movieScheduleDto.start_time;
    schedule.end_time = movieScheduleDto.end_time;
    schedule.date = movieScheduleDto.date;

    return await this.movieScheduleRepository.save(schedule);
  }

  async findAllSchedule(query?: any): Promise<PaginateResult> {
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
    const result = await this.movieScheduleRepository.findAndCount({
      take: paginateLimit,
      skip: offset,
      relations: {
        movie: true,
        studio: true,
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
}
