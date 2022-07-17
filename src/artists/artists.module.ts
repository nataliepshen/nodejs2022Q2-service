import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  imports: [
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService, TracksService, AlbumsService, FavoritesService],
})
export class ArtistsModule {}
