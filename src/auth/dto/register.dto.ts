import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { UniqueEmail } from 'src/user/decorators/unique-email.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @UniqueEmail({
    message: 'Email is already registered',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})/, {
    message:
      'Password must be at least 10 characters long, including lowercase, uppercase, and numbers.',
  })
  password: string;

  avatar: string;
}
