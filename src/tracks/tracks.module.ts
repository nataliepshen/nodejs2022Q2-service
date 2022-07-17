import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { ArtistsModule } from 'src/artists/artists.module';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { AlbumsService } from 'src/albums/albums.service';

@Module({
  imports: [forwardRef(() => ArtistsModule), forwardRef(() => AlbumsModule)],
  controllers: [TracksController],
  providers: [TracksService, ArtistsService, AlbumsService]
})
export class TracksModule {}
