import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateUserDto } from '../../src/auth/dtos/create-user.dto';
import { LoginUserDto } from '../../src/auth/dtos/login-user.dto';
import { SellerDto } from '../../src/auth/dtos/seller-dto';
import { UpdateUserDto } from '../../src/auth/dtos/update-user.dto';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';


describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Importa tu módulo principal
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    const entities = dataSource.entityMetadatas;
  
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  
    await app.close();
  });

  // Variables de prueba para ser reutilizadas
  const createUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'StrongPass1',
    name: 'Test User',
  };

  const loginUserDto: LoginUserDto = {
    email: 'test@example.com',
    password: 'StrongPass1',
  };

  const sellerDto: SellerDto = {
    phone: '3022852699',
    location: 'CO',
  };

  const updateUserDto = {
    name: 'Updated Test User'
  };

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201)
        .then(({ body }) => {
          expect(body.email).toEqual(createUserDto.email);
          expect(body.name).toEqual(createUserDto.name);
        });
    });

    
    it('should throw BadRequestException for duplicate email', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });
    
  });

  describe('/auth/login (POST)', () => {
    it('should login the user and return a token', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(201)
        .then(({ body }) => {
          expect(body.token).toBeDefined();
          userId = body.user_id
          accessToken = body.token; // Guardamos el token para futuras solicitudes autenticadas
        });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const invalidLoginDto = { ...loginUserDto, password: 'InvalidPass' };
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(401);
    });
  });
  
  describe('/auth/seller (POST)', () => {
    it('should update the user to seller', async () => {
      return request(app.getHttpServer())
        .post('/auth/seller')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(sellerDto)
        .expect(201)
        .then(({ body }) => {
          expect(body.roles).toContain('seller');
        });
    });
  });
  
  describe('/auth/info (GET)', () => {
    it('should return the current user information', async () => {
      return request(app.getHttpServer())
        .get('/auth/info')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.email).toEqual(loginUserDto.email);
        });
    });
  });
  
  describe('/auth/users (GET)', () => {
    it('should return a list of users with pagination', async () => {
      return request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ limit: 10, offset: 0 })
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
        });
    });
  });

  describe('/auth/:name (GET)', () => {
    it('should return users by name with pagination', async () => {
      return request(app.getHttpServer())
        .get('/auth/Testuser')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ limit: 10, offset: 0 })
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
        });
    });
  });
  
  describe('/auth (PUT)', () => {
    it('should update the current user', async () => {
      return request(app.getHttpServer())
        .put('/auth')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(200)
        .then(({ body }) => {
          console.log(body)
          expect(body.name).toEqual(updateUserDto.name);
        });
    });
  });
  
  describe('/auth/:id (DELETE)', () => {
    it('should deactivate a user', async () => {
      return request(app.getHttpServer())
        .delete(`/auth/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.isActive).toBe(false);
        });
    });
  });
});