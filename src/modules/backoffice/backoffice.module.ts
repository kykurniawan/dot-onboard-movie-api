import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MovieModule } from 'src/modules/movie/movie.module';
import { BackofficeController } from './backoffice.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads/movie_posters',
        filename(req, file, callback) {
          callback(null, Date.now() + extname(file.originalname));
        },
      }),
    }),
    MovieModule,
  ],
  controllers: [BackofficeController],
})
export class BackofficeModule {}
