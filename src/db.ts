import { Global, Injectable, Module } from '@nestjs/common';
import { Album } from './albums/entities/album.entity';
import { Artist } from './artists/entities/artist.entity';
import { Favorites } from './favorites/entities/favorites.entity';
import { Track } from './tracks/entities/track.entity';
import { User } from './users/entities/user.entity';

@Injectable()
export class InMemoryDB {
  users: User[] = [];
  tracks: Track[] = [];
  artists: Artist[] = [];
  albums: Album[] = [];
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}

@Global()
@Module({
  providers: [InMemoryDB],
  exports: [InMemoryDB],
})
export class InMemoryDBModule {}
