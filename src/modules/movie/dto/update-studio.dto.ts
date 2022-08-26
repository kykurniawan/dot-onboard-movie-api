import { IsOptional, MinLength } from 'class-validator';

export class UpdateStudioDto {
  @IsOptional()
  @MinLength(2)
  studio_number: number;

  @IsOptional()
  seat_capacity: number;
}
