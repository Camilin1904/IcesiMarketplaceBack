import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../../src/categories/dto/update-category.dto';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../../src/auth/dtos/create-user.dto';
import { LoginUserDto } from '../../src/auth/dtos/login-user.dto';
import { SellerDto } from '../../src/auth/dtos/seller-dto';

describe('CategoriesController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let categoryId: string; // Guardaremos el ID de la categoría para pruebas de actualización y eliminación
    let wrongId = crypto.randomUUID();

    const createUserDto: CreateUserDto = {
        email: 'category@example.com',
        password: 'StrongPass1',
        name: 'Category User',
      };
    
    const loginUserDto: LoginUserDto = {
    email: 'category@example.com',
    password: 'StrongPass1',
    };

    const sellerDto: SellerDto = {
    phone: '3022852699',
    location: 'CO',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule], // Importa el módulo principal de tu app
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            }),
        );
        await app.init();

        await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)

        await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .then(({ body }) => {
          accessToken = body.token;
        });

        await request(app.getHttpServer())
        .post('/auth/seller')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(sellerDto)
    }, 70 * 1000);

    afterAll(async () => {
        // Limpiar la base de datos
        const dataSource = app.get<DataSource>(getDataSourceToken());
    
        // Obtener los nombres de todas las tablas
        const tables = await dataSource.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public';  -- Cambia esto si usas otro esquema
        `);
    
        // Borrar todas las tablas
        for (const table of tables) {
          await dataSource.query(`DROP TABLE IF EXISTS "${table.table_name}" CASCADE;`);
        }
    });

    // Variables de prueba para ser reutilizadas
    const createCategoryDto: CreateCategoryDto = {
    name: 'Test Category',
    description: 'Test Description',
    };

    const updateCategoryDto: UpdateCategoryDto = {
    name: 'Updated Test Category',
    description: 'Updated Test Description',
    };

    describe('/categories (POST)', () => {
        it('should create a new category', () => {
            return request(app.getHttpServer())
            .post('/categories')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(createCategoryDto)
            .expect(201)
            .then(({ body }) => {
                categoryId = body.id; // Guardamos el ID de la categoría para futuras pruebas
                expect(body.name).toEqual(createCategoryDto.name);
                expect(body.description).toEqual(createCategoryDto.description);
            });
        });
    });

    describe('/categories (GET)', () => {
        it('should return a list of categories with pagination', async () => {
            return request(app.getHttpServer())
            .get('/categories')
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ limit: 10, offset: 0 })
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body)).toBe(true);
                expect(body.length).toBeGreaterThan(0); // Verificamos que haya al menos una categoría
            });
        });
    });

    describe('/categories/:term (GET)', () => {
        it('should return a category by its name or slug', async () => {
            return request(app.getHttpServer())
            .get(`/categories/${createCategoryDto.name}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.name).toEqual(createCategoryDto.name);
                expect(body.description).toEqual(createCategoryDto.description);
            });
        });

        it('should return 404 if category does not exist', async () => {
            return request(app.getHttpServer())
            .get('/categories/nonexistent-category')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
        });
    });

    describe('/categories/:id (PATCH)', () => {
        it('should update a category by ID', async () => {
            return request(app.getHttpServer())
            .patch(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateCategoryDto)
            .expect(200)
            .then(({ body }) => {
                expect(body.name).toEqual(updateCategoryDto.name);
                expect(body.description).toEqual(updateCategoryDto.description);
            });
        });
        it('should return 404 if category does not exist', async () => {
            return request(app.getHttpServer())
            .patch(`/categories/${wrongId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(updateCategoryDto)
            .expect(404);
        });
    });

    describe('/categories/subscribe (POST)', () => {
        it('should subscribe a user to a category', async () => {
            return request(app.getHttpServer())
            .post('/categories/subscribe')
            .set('Authorization', `Bearer ${accessToken}`) // Autenticación
            .send({ categoryId }) // El ID de la categoría a la que se suscribe el usuario
            .expect(201)
            .then(({ body }) => {
                expect(body.name).toEqual(updateCategoryDto.name);
            });
        });
    
        it('should return 401 if user is not authenticated', async () => {
            return request(app.getHttpServer())
            .post('/categories/subscribe')
            .send({ categoryId })
            .expect(401);
        });
    });
    
    describe('/categories/:id (DELETE)', () => {
        it('should delete a category by ID', async () => {
            return request(app.getHttpServer())
            .delete(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.name).toEqual(updateCategoryDto.name);
            });
        });

        it('should return 404 if category does not exist', async () => {
            return request(app.getHttpServer())
            .delete(`/categories/${wrongId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
        });
    });
    
});
