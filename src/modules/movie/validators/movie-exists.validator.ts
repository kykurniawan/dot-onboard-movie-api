import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import { MovieService } from '../services/movie.service';

@ValidatorConstraint({ name: 'movieExists', async: true })
@Injectable()
export class MovieExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly movieService: MovieService) {}

  async validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return true;
    }
    const movie = await this.movieService.findMovieById(parseInt(value));
    if (!movie) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Movie with id: ' + validationArguments.value + ' is not exists.';
  }
}
