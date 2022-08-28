import { IsNotEmpty } from 'class-validator';
import { MovieExists } from '../decorators/movie-exists.decorator';
import { StudioExists } from '../decorators/studio-exists.validator';

export class CreateMovieScheduleDto {
  @IsNotEmpty()
  @MovieExists()
  movie_id: number;

  @IsNotEmpty()
  @StudioExists()
  studio_id: number;

  @IsNotEmpty()
  start_time: string;

  @IsNotEmpty()
  end_time: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  date: Date;
}
