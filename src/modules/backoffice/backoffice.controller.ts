import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, Express } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { MovieService } from 'src/modules/movie/movie.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateMovieDto } from '../movie/dto/create-movie.dto';
import { CreateTagDto } from '../movie/dto/create-tag.dto';
import { UpdateMovieDto } from '../movie/dto/update-movie.dto';

@Controller('backoffice')
@UseGuards(JwtAuthGuard, AdminGuard)
export class BackofficeController {
  constructor(private readonly movieService: MovieService) {}

  @Post('movies')
  @UseInterceptors(FileInterceptor('poster'))
  async createMovie(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ],
      }),
    )
    poster: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto,
    @Res()
    res: Response,
  ) {
    createMovieDto.poster = poster.filename;
    const newMovie = await this.movieService.createMovie(createMovieDto);

    return res.status(201).json({
      success: true,
      message: 'movie created',
      data: {
        item: newMovie,
      },
    });
  }

  @Put('movies/:id')
  @UseInterceptors(FileInterceptor('poster'))
  async updateMovie(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    poster: Express.Multer.File,
    @Body() updateMovieDto: UpdateMovieDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const movie = await this.movieService.findMovieById(parseInt(id));
    if (!movie) {
      throw new NotFoundException();
    }
    if (poster) {
      updateMovieDto.poster = poster.filename;
    }

    const updatedMovie = await this.movieService.updateMovie(
      parseInt(id),
      updateMovieDto,
    );

    return res.status(200).json({
      success: true,
      message: 'movie updated',
      data: {
        item: updatedMovie,
      },
    });
  }

  @Get('movies')
  async movieList(@Req() req: Request, @Res() res: Response) {
    const queryParams = req.query;
    const results = await this.movieService.findAllMovie(queryParams);
    return res.json({
      success: true,
      message: 'ok',
      data: results,
    });
  }

  @Post('tags')
  async createTag(@Body() createTagDto: CreateTagDto, @Res() res: Response) {
    const newTag = await this.movieService.createTag(createTagDto.name);

    return res.status(201).json({
      success: true,
      message: 'tag created',
      data: {
        item: newTag,
      },
    });
  }

  @Get('tags')
  async tagList(@Res() res: Response) {
    const tags = await this.movieService.findAllTag();

    return res.status(200).json({
      success: true,
      message: 'ok',
      data: {
        items: tags,
      },
    });
  }
}
