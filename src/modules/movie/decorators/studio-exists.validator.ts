import { registerDecorator, ValidationOptions } from 'class-validator';
import { StudioExistsValidator } from '../validators/studio-exitst.validator';

export function StudioExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: StudioExistsValidator,
    });
  };
}
