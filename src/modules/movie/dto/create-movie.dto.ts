import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { TagsExists } from '../decorators/tags-exists.decorator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  overview: string;

  @IsNotEmpty()
  @IsDateString()
  play_until: Date;

  poster: string;

  @IsArray()
  @ArrayMinSize(1)
  @TagsExists({ each: true })
  tags: number[];
}
