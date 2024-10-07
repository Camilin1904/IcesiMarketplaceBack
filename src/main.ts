import createApp from './app';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const application = await createApp();
    application.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    await application.listen(process.env.PORT || 3000);
}

bootstrap();
