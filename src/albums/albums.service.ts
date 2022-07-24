import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private prisma: PrismaService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.prisma.album.create({
      data: {
        id: uuidv4(),
        ...createAlbumDto,
      }
    });
    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album | undefined> {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      }
    });
    if (!album) {
      throw new NotFoundException('Album Not Found');
    } else {
      return album;
    }
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | undefined> {
    await this.findOne(id);
    const updateAlbum = await this.prisma.album.update({
      where: {
        id
      },
      data: updateAlbumDto,
    });
    return updateAlbum;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.album.delete({
      where: {
        id
      }
    });
      // this.db.albums.splice(index, 1);
      // this.db.favorites.albums.splice(albumInFavs, 1);
      // this.db.tracks.forEach((track) => {
      //   if (track.albumId === id) {
      //     track.albumId = null;
      //   }
      // });
  }
}
