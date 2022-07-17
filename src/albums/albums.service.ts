import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';
import { InMemoryDB } from 'src/db';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private db: InMemoryDB) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      id: uuidv4(),
      ...createAlbumDto,
    }
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    return this.db.albums;
  }

  async findOne(id: string): Promise<Album | undefined> {
    const album: Album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album Not Found');
    }
    else {
      return album;
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album | undefined> {
    const album: Album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album Not Found');
    }
    else {
      Object.assign(album, updateAlbumDto);
      return album;
    }
  }

  async remove(id: string): Promise<void> {
    const index: number = this.db.albums.findIndex((a) => a.id === id);
    const albumInFavs: number = this.db.favorites.albums.findIndex((i) => i === id);
    if (index === -1) {
      throw new NotFoundException('Album Not Found');
    }
    else {
      this.db.albums.splice(index, 1);
      this.db.favorites.albums.splice(albumInFavs, 1);
      this.db.tracks.forEach((track) => {
        if (track.albumId === id) {
          track.albumId = null;
        }
      })
    }
  }
}
