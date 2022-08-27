import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import { MovieScheduleService } from '../services/movie-schedule.service';

@ValidatorConstraint({ name: 'scheduleExists', async: true })
@Injectable()
export class ScheduleExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly movieScheduleService: MovieScheduleService) {}

  async validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    if (!value) {
      return true;
    }
    const schedule = await this.movieScheduleService.findOneScheduleById(
      parseInt(value),
    );
    if (!schedule) {
      return false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Schedule with id: ' + validationArguments.value + ' is not exists.';
  }
}
