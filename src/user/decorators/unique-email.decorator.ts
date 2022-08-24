import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator';

export function UniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueEmailValidator,
    });
  };
}
