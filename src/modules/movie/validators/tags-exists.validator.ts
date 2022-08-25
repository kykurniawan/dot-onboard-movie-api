import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import { MovieService } from '../movie.service';

@ValidatorConstraint({ name: 'tagsExists', async: true })
@Injectable()
export class TagsExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly movieService: MovieService) {}

  async validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return true;
    }
    const tag = await this.movieService.findTagById(parseInt(value));
    if (!tag) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'One or more tag items is not exists.';
  }
}
