import { forwardRef, Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TracksModule } from 'src/tracks/tracks.module';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { AlbumsService } from 'src/albums/albums.service';

@Module({
  imports: [forwardRef(() => TracksModule), forwardRef(() => AlbumsModule)],
  controllers: [ArtistsController],
  providers: [ArtistsService, TracksService, AlbumsService]
})
export class ArtistsModule {}
