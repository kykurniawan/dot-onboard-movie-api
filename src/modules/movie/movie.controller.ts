import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UseFilters,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpExceptionFilter } from 'src/app.filter';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { MovieService } from './services/movie.service';

@Controller('movies')
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async movieList(@Req() req: Request, @Res() res: Response) {
    const result = await this.movieService.findAllMovie(req.query);
    return res.json({
      success: true,
      message: 'ok',
      data: result,
    });
  }

  @Get(':id')
  async detailMovie(@Req() req: Request, @Res() res: Response) {
    const movie = await this.movieService.findMovieById(Number(req.params.id));

    if (!movie) {
      throw new NotFoundException();
    }

    return res.status(200).json({
      success: true,
      message: 'ok',
      data: {
        item: movie,
      },
    });
  }
}
