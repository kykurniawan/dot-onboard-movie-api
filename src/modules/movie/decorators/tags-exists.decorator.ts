import { registerDecorator, ValidationOptions } from 'class-validator';
import { TagsExistsValidator } from '../validators/tags-exists.validator';

export function TagsExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: TagsExistsValidator,
    });
  };
}
