import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InMemoryDBModule } from './db';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [UsersModule, InMemoryDBModule, TracksModule, ArtistsModule, AlbumsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
