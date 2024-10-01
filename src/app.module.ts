import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsController } from './cars/cars.controller';
import { CarsModule } from './cars/cars.module';
import { BrandsModule } from './brands/brands.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config'
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    CarsModule,
    BrandsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      database:process.env.DB_NAME,
      username:process.env.DB_USER,
      password:process.env.DB_PASSWORD,
      port:+process.env.DB_PORT,
      autoLoadEntities:true,
      synchronize:true,
    }),
    CommonModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
