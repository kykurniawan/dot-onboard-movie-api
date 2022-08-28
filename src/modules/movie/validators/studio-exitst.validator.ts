import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import { MovieScheduleService } from '../services/movie-schedule.service';

@ValidatorConstraint({ name: 'studioExists', async: true })
@Injectable()
export class StudioExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly movieScheduleService: MovieScheduleService) {}

  async validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return true;
    }
    const studio = await this.movieScheduleService.findOneStudio(
      parseInt(value),
    );
    if (!studio) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Studio with id: ' + validationArguments.value + ' is not exists.';
  }
}
