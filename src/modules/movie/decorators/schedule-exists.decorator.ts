import { registerDecorator, ValidationOptions } from 'class-validator';
import { ScheduleExistsValidator } from '../validators/schedule-exists.validator';

export function ScheduleExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ScheduleExistsValidator,
    });
  };
}
