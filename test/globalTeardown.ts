import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

let app: INestApplication;

async function closeApp() {
  if (!app) {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }

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

  // Cerrar la aplicación
  await app.close();
}

export default closeApp;
