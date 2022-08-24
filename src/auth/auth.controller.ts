import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ) {
    registerDto.avatar = avatar.filename;
    const registerResult = await this.authService.register(registerDto);
    const token = await this.authService.login(registerResult);
    return res.status(200).json({
      success: true,
      message: 'register success',
      data: {
        token: token,
      },
    });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = await this.authService.login(req.user);
    return res.status(200).json({
      success: true,
      message: 'login success',
      data: {
        token: token,
      },
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request, @Res() res: Response) {
    return res.json(req.user);
  }
}
