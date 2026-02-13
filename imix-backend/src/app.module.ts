import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModule } from './requests/requests.module';

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error(
    'Missing required environment variable MONGODB_URI. Set it in imix-backend/.env before starting the API.',
  );
}

@Module({
  imports: [
    MongooseModule.forRoot(mongodbUri),
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
