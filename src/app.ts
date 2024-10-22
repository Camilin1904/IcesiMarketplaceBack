import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function createApp() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    return app;
}

export default createApp;
