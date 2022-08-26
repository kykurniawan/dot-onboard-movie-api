import { MovieSchedule } from '../entities/movie-schedule.entity';
import { Movie } from '../entities/movie.entity';
import { Tag } from '../entities/tag.entity';

export interface PaginateResult {
  items: Array<Movie | Tag | MovieSchedule>;
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    previous_link: string;
    next_link: string;
  };
}
