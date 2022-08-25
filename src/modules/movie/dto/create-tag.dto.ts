import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  name: string;
}
