import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TagsExists } from '../decorators/tags-exists.decorator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  overview: string;

  @IsOptional()
  @IsDateString()
  play_until: Date;

  poster: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @TagsExists({ each: true })
  tags: number[];
}
