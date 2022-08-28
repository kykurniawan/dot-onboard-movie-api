import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigTest } from '../src/configs/typeorm.config';
import { AuthService } from '../src/modules/auth/auth.service';
import { useContainer } from 'class-validator';
import { Tag } from '../src/modules/movie/entities/tag.entity';
import { MovieService } from '../src/modules/movie/services/movie.service';
import { Studio } from '../src/modules/movie/entities/studio.entity';
import { Movie } from '../src/modules/movie/entities/movie.entity';
import { MovieScheduleService } from '../src/modules/movie/services/movie-schedule.service';
import { MovieSchedule } from '../src/modules/movie/entities/movie-schedule.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let tag: Tag;
  let studio: Studio;
  let movie: Movie;
  let schedule: MovieSchedule;
  const email = 'user@mail.com';
  const password = 'passwordMAD1245';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeOrmConfigTest), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
      defaultVersion: '1',
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();

    const authService = await app.get(AuthService);
    const movieService = await app.get(MovieService);
    const movieScheduleService = await app.get(MovieScheduleService);

    await authService.register({
      name: 'user',
      email: email,
      password: password,
      avatar: 'avatar.jpg',
    });

    tag = await movieService.createTag('Tag Keren');

    studio = await movieScheduleService.createStudio(8766, 2000);

    movie = await movieService.createMovie({
      title: 'title',
      overview: 'overview',
      play_until: new Date('2022-05-05'),
      poster: 'poster.jpg',
      tags: [tag.id],
    });

    schedule = await movieScheduleService.createSchedule({
      movie_id: movie.id,
      studio_id: studio.id,
      price: 2000,
      start_time: '20:00',
      end_time: '21:00',
      date: new Date('2022-03-03'),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('root path', () => {
    it('should return 200 status code', () => {
      return request(app.getHttpServer()).get('/api/v1').expect(200);
    });
  });

  describe('Authentication & Authorization', () => {
    describe('when registering new user with invalid data', () => {
      it('should return 400 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .field('name', 'Rizky')
          .field('email', 'mail@mail.com')
          .field('password', 'passwordMAD1245')
          .expect(400);
      });
    });

    describe('when registering new user with valid data', () => {
      it('should return 200 status code', () => {
        const filePath = `${__dirname}/image.jpg`;
        return request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .field('name', 'Rizky')
          .field('email', 'mailmail@mail.com')
          .field('password', 'passwordMAD1245')
          .attach('avatar', filePath, {
            contentType: 'image/jpeg',
            filename: 'image.jpg',
          })
          .expect(200);
      });
    });

    describe('when login with invalid credential', () => {
      it('should return 401 statuc code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: 'invalid@mail.com',
            password: 'invalidpassword',
          })
          .expect(401);
      });
    });

    describe('when login with valid credential', () => {
      it('should return 200 statuc code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: email,
            password: password,
          })
          .expect(200);
      });
    });
  });

  describe('Backoffice', () => {
    let token = '';
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: email, password: password });
      token = response.body.data._token;
    });

    describe('when creating new tag with valid data', () => {
      it('should return 201 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/tags')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'New Tag',
          })
          .expect(201);
      });
    });

    describe('when creating new tag with invalid data', () => {
      it('should return 400 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/tags')
          .set('Authorization', 'Bearer ' + token)
          .send({})
          .expect(400);
      });
    });

    describe('when getting all tag', () => {
      it('should return 200 status code', () => {
        return request(app.getHttpServer())
          .get('/api/v1/backoffice/tags')
          .set('Authorization', 'Bearer ' + token)
          .expect(200);
      });
    });

    describe('when creating new studio with valid data', () => {
      it('should return 201 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/studios')
          .set('Authorization', 'Bearer ' + token)
          .send({
            studio_number: 1234,
            seat_capacity: 1000,
          })
          .expect(201);
      });
    });

    describe('when creating new studio with invalid data', () => {
      it('should return 400 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/studios')
          .set('Authorization', 'Bearer ' + token)
          .send({
            studio_number: 3214,
          })
          .expect(400);
      });
    });

    describe('when getting all studio', () => {
      it('should return 200 status code', () => {
        return request(app.getHttpServer())
          .get('/api/v1/backoffice/studios')
          .set('Authorization', 'Bearer ' + token)
          .expect(200);
      });
    });

    describe('when creating new movie with valid data', () => {
      it('should return 201 status code', () => {
        const filePath = `${__dirname}/image.jpg`;
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/movies')
          .set('Authorization', 'Bearer ' + token)
          .field('title', 'Movie 1')
          .field('overview', 'overview')
          .field('play_until', '2022-09-09')
          .field('tags[0]', tag.id)
          .attach('poster', filePath, {
            contentType: 'image/jpeg',
            filename: 'image.jpg',
          })
          .expect(201);
      });
    });

    describe('when creating new movie with invalid data', () => {
      it('should return 400 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/movies')
          .set('Authorization', 'Bearer ' + token)
          .field('title', 'Movie 1')
          .field('overview', 'overview')
          .field('play_until', '2022-09-09')
          .field('tags[0]', tag.id)
          .expect(400);
      });
    });

    describe('when getting all movie', () => {
      it('should return 200 status code', () => {
        return request(app.getHttpServer())
          .get('/api/v1/backoffice/movies')
          .set('Authorization', 'Bearer ' + token)
          .expect(200);
      });
    });

    describe('when creating new schedule with valid data', () => {
      it('should return 201 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/schedules')
          .set('Authorization', 'Bearer ' + token)
          .send({
            movie_id: movie.id,
            studio_id: studio.id,
            price: 5000,
            start_time: '20:20',
            end_time: '22:20',
            date: '2022-04-06',
          })
          .expect(201);
      });
    });

    describe('when creating new schedule with invalid data', () => {
      it('should return 400 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/backoffice/schedules')
          .set('Authorization', 'Bearer ' + token)
          .send({
            start_time: '20:20',
            end_time: '22:20',
            date: '2022-04-06',
          })
          .expect(400);
      });
    });

    describe('when getting all schedule', () => {
      it('should return 200 status code', () => {
        return request(app.getHttpServer())
          .get('/api/v1/backoffice/schedules')
          .set('Authorization', 'Bearer ' + token)
          .expect(200);
      });
    });
  });

  describe('Regular user', () => {
    let token = '';
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: email, password: password });
      token = response.body.data._token;
    });

    describe('when getting all movie', () => {
      it('should return 200 status code', () => {
        return request(app.getHttpServer())
          .get('/api/v1/movies')
          .set('Authorization', 'Bearer ' + token)
          .expect(200);
      });
    });

    describe('when preview order', () => {
      it('should return 200 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/order/preview')
          .set('Authorization', 'Bearer ' + token)
          .send({
            items: [
              {
                movie_schedule_id: schedule.id,
                qty: 10,
              },
            ],
            payment_method: 'linkaja',
          })
          .expect(200);
      });
    });

    describe('when checkcout order', () => {
      it('should return 201 status code', () => {
        return request(app.getHttpServer())
          .post('/api/v1/order/checkout')
          .set('Authorization', 'Bearer ' + token)
          .send({
            items: [
              {
                movie_schedule_id: schedule.id,
                qty: 10,
              },
            ],
            payment_method: 'linkaja',
          })
          .expect(201);
      });
    });
  });
});
