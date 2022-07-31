import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDB } from 'src/db/db';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private db: InMemoryDB,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    return this.db.tracks;
  }

  async findOne(id: string): Promise<Track | undefined> {
    const track: Track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track Not Found');
    } else {
      return track;
    }
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | undefined> {
    const track: Track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track Not Found');
    } else {
      Object.assign(track, updateTrackDto);
      return track;
    }
  }

  async remove(id: string): Promise<void> {
    const index: number = this.db.tracks.findIndex((t) => t.id === id);
    const trackInFavs: number = this.db.favorites.tracks.findIndex(
      (i) => i === id,
    );
    if (index === -1) {
      throw new NotFoundException('Track Not Found');
    } else {
      this.db.tracks.splice(index, 1);
      this.db.favorites.tracks.splice(trackInFavs, 1);
    }
  }
}
