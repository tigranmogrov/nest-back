import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';

const productId = new Types.ObjectId().toHexString();
const textDto = {
  name: 'test',
  title: 'title',
  description: 'desc',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create/ (POST) ---Success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(textDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/create/ (POST) ---Fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...textDto, rating: 0 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
