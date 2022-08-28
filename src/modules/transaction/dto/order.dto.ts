import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ScheduleExists } from 'src/modules/movie/decorators/schedule-exists.decorator';

export class OrderItemDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ScheduleExists()
  movie_schedule_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  qty: number;
}

export class OrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty()
  @IsString()
  payment_method: string;
}
