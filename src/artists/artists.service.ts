import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    private prisma: PrismaService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.prisma.artist.create({
      data: {
        id: uuidv4(),
        ...createArtistDto,
      }
    })
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      }
    });
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
    await this.findOne(id);
    const updateArtist = await this.prisma.artist.update({
      where: {
        id
      },
      data: updateArtistDto,
    });
    return updateArtist;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.artist.delete({
      where: {
        id
      }
    });
    // const artistInFavs: number = this.db.favorites.artists.findIndex(
    //   (i) => i === id,
    // );
      // this.db.favorites.artists.splice(artistInFavs, 1);
      // this.db.tracks.forEach((track) => {
      //   if (track.artistId === id) {
      //     track.artistId = null;
      //   }
      // });
      // this.db.albums.forEach((album) => {
      //   if (album.artistId === id) {
      //     album.artistId = null;
      //   }
      // });
  }
}
