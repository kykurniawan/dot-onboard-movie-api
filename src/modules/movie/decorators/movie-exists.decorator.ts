import { registerDecorator, ValidationOptions } from 'class-validator';
import { MovieExistsValidator } from '../validators/movie-exists.validator';

export function MovieExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: MovieExistsValidator,
    });
  };
}
