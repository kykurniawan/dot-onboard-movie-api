import { Module, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/avatars',
        filename(req, file, callback) {
          callback(null, Date.now() + extname(file.originalname));
        },
      }),
      fileFilter(req, file, callback) {
        if (file.mimetype !== 'image/jpeg') {
          return callback(
            new BadRequestException(
              'Only file with image/jpg mimetype are allowed',
            ),
            false,
          );
        }
        if (file.size > 2000000) {
          return callback(
            new BadRequestException('Maximum file size is 2MB'),
            false,
          );
        }
        return callback(null, true);
      },
    }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
