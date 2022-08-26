import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueStudioNumberValidator } from '../validators/unique-studio-number.validator';

export function UniqueStudioNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueStudioNumberValidator,
    });
  };
}
