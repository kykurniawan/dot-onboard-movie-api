import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpExceptionFilter } from 'src/app.filter';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { MovieService } from './movie.service';

@Controller('movies')
@UseFilters(new HttpExceptionFilter())
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async movieList(@Req() req: Request, @Res() res: Response) {
    const result = await this.movieService.findAllMovie(req.query);
    return res.json({
      success: true,
      message: 'ok',
      data: result,
    });
  }
}
