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
  UseFilters,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, Express } from 'express';
import { HttpExceptionFilter } from 'src/app.filter';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { MovieService } from 'src/modules/movie/services/movie.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateMovieScheduleDto } from '../movie/dto/create-movie-schedule.dto';
import { CreateMovieDto } from '../movie/dto/create-movie.dto';
import { CreateStudioDto } from '../movie/dto/create-studio.dto';
import { CreateTagDto } from '../movie/dto/create-tag.dto';
import { UpdateMovieDto } from '../movie/dto/update-movie.dto';
import { UpdateStudioDto } from '../movie/dto/update-studio.dto';
import { MovieScheduleService } from '../movie/services/movie-schedule.service';

@Controller('backoffice')
@UseGuards(JwtAuthGuard, AdminGuard)
@UseFilters(new HttpExceptionFilter())
export class BackofficeController {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieScheduleService: MovieScheduleService,
  ) {}

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
  async tagList(@Req() req: Request, @Res() res: Response) {
    const results = await this.movieService.findAllTag(req.query);

    return res.status(200).json({
      success: true,
      message: 'ok',
      data: results,
    });
  }

  @Post('studios')
  async createStudio(
    @Body() createStudioDto: CreateStudioDto,
    @Res() res: Response,
  ) {
    const newStudio = await this.movieScheduleService.createStudio(
      createStudioDto.studio_number,
      createStudioDto.seat_capacity,
    );

    return res.status(201).json({
      success: true,
      message: 'studio created',
      data: {
        item: newStudio,
      },
    });
  }

  @Put('studios/:id')
  async updateStudio(
    @Req() req: Request,
    @Body() updateStudioDto: UpdateStudioDto,
    @Res() res: Response,
  ) {
    const { id } = req.params;

    if (updateStudioDto.studio_number) {
      const studioExists =
        await this.movieScheduleService.findOneStudioByStudioNumber(
          updateStudioDto.studio_number,
        );

      if (studioExists && studioExists.studio_number != Number(id)) {
        throw new BadRequestException(
          { message: 'Studio number is already used' },
          'Validation Error',
        );
      }
    }

    await this.movieScheduleService.updateStudio(Number(id), updateStudioDto);

    return res.status(200).json({
      success: true,
      message: 'studio updated',
      data: {
        studioId: id,
      },
    });
  }

  @Get('studios')
  async studioList(@Res() res: Response) {
    const studios = await this.movieScheduleService.findAllStudio();

    return res.status(200).json({
      success: true,
      message: 'ok',
      data: {
        items: studios,
      },
    });
  }

  @Get('studios/:id')
  async studioDetail(@Req() req: Request, @Res() res: Response) {
    const studio = await this.movieScheduleService.findOneStudio(
      Number(req.params.id),
    );

    if (!studio) {
      throw new NotFoundException();
    }

    return res.status(200).json({
      success: true,
      message: 'ok',
      data: {
        item: studio,
      },
    });
  }

  @Post('schedules')
  async createMovieSchedule(
    @Body() movieScheduleDto: CreateMovieScheduleDto,
    @Res() res: Response,
  ) {
    const schedule = await this.movieScheduleService.createSchedule(
      movieScheduleDto,
    );

    return res.status(201).json({
      success: true,
      message: 'schedule created',
      data: {
        item: schedule,
      },
    });
  }

  @Get('schedules')
  async movieScheduleList(@Req() req: Request, @Res() res: Response) {
    const results = await this.movieScheduleService.findAllSchedule(req.query);

    return res.status(200).json({
      success: true,
      message: 'ok',
      data: results,
    });
  }
}
