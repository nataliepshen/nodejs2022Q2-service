import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';

@Module({
  imports: [forwardRef(() => ArtistsModule), forwardRef(() => TracksModule), forwardRef(() => AlbumsModule)],
  controllers: [FavoritesController],
  providers: [FavoritesService, ArtistsService, AlbumsService, TracksService]
})
export class FavoritesModule {}
