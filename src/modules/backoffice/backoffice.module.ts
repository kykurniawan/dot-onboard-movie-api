import { Module, BadRequestException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MovieModule } from '../movie/movie.module';
import { BackofficeController } from './backoffice.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/movie_posters',
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
    MovieModule,
  ],
  controllers: [BackofficeController],
})
export class BackofficeModule {}
