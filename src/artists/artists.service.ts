import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDB } from 'src/db';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private db: InMemoryDB,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return this.db.artists;
  }

  async findOne(id: string): Promise<Artist | undefined> {
    const artist: Artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist Not Found');
    } else {
      return artist;
    }
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | undefined> {
    const artist: Artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist Not Found');
    } else {
      Object.assign(artist, updateArtistDto);
      return artist;
    }
  }

  async remove(id: string): Promise<void> {
    const index: number = this.db.artists.findIndex((a) => a.id === id);
    const artistInFavs: number = this.db.favorites.artists.findIndex(
      (i) => i === id,
    );
    if (index === -1) {
      throw new NotFoundException('Artist Not Found');
    } else {
      this.db.artists.splice(index, 1);
      this.db.favorites.artists.splice(artistInFavs, 1);
      this.db.tracks.forEach((track) => {
        if (track.artistId === id) {
          track.artistId = null;
        }
      });
      this.db.albums.forEach((album) => {
        if (album.artistId === id) {
          album.artistId = null;
        }
      });
    }
  }
}
