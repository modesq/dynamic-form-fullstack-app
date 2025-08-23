import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedingService } from './seeding.service';

async function bootstrap() {
  try {
    console.log('🔄 Initializing application...');
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const seedingService = app.get(SeedingService);
    await seedingService.runAllSeeds();
    
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

bootstrap();