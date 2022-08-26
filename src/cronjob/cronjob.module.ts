import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MovieModule } from 'src/modules/movie/movie.module';
import { CronjobService } from './cronjob.service';

@Module({
  imports: [HttpModule, MovieModule],
  providers: [CronjobService],
})
export class CronjobModule {}
