import { IsNotEmpty } from 'class-validator';
import { UniqueStudioNumber } from '../decorators/unique-studio-number.decorator';

export class CreateStudioDto {
  @IsNotEmpty()
  @UniqueStudioNumber()
  studio_number: number;

  @IsNotEmpty()
  seat_capacity: number;
}
