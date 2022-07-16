import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InMemoryDBModule } from './db';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, InMemoryDBModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
