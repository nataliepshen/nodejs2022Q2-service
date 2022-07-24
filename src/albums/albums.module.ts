import { Module, forwardRef } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { ArtistsModule } from 'src/artists/artists.module';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
    PrismaModule
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, ArtistsService, TracksService, FavoritesService],
})
export class AlbumsModule {}
