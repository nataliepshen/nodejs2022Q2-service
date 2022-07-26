import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from 'src/albums/entities/album.entity';
import { PrismaService } from 'src/db/prisma.service';
import { Track } from 'src/tracks/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async addArtistToFavorites(id: string): Promise<string> {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id
      }
    });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    } else {
      await this.prisma.favorites.create({
        data: {
          artists: {
            connect: { id }
          }
        }
      });
      return 'Artist was successfully added to Favorites';
    }
  }

  // async addArtistToFavorites(id: string): Promise<string> {
  //   const artist: Artist = this.db.artists.find((a) => a.id === id);
  //   if (!artist) {
  //     throw new UnprocessableEntityException(
  //       `Artist with id ${id} doesn't exist`,
  //     );
  //   } else {
  //     this.db.favorites.artists.push(artist.id);
  //     return 'Artist was successfully added to Favorites';
  //   }
  // }

  // async addAlbumToFavorites(id: string): Promise<string> {
  //   const album: Album = this.db.albums.find((a) => a.id === id);
  //   if (!album) {
  //     throw new UnprocessableEntityException(
  //       `Album with id ${id} doesn't exist`,
  //     );
  //   } else {
  //     this.db.favorites.albums.push(album.id);
  //     return 'Album was successfully added to Favorites';
  //   }
  // }

  // async addTrackToFavorites(id: string): Promise<string> {
  //   const track: Track = this.db.tracks.find((t) => t.id === id);
  //   if (!track) {
  //     throw new UnprocessableEntityException(
  //       `Track with id ${id} doesn't exist`,
  //     );
  //   } else {
  //     this.db.favorites.tracks.push(track.id);
  //     return 'Track was successfully added to Favorites';
  //   }
  // }

  // async findAll(): Promise<any> {
  //   const favorites = await this.prisma.favorites.findMany();
  //   // const albums = this.db.favorites.albums.map((albumId) =>
  //   //   this.db.albums.find(({ id }) => id === albumId),
  //   // );
  //   // const artists = this.db.favorites.artists.map((artistId) =>
  //   //   this.db.artists.find(({ id }) => id === artistId),
  //   // );
  //   // const tracks = this.db.favorites.tracks.map((trackId) =>
  //   //   this.db.tracks.find(({ id }) => id === trackId),
  //   // );
  //   // const favorites = {
  //   //   artists,
  //   //   albums,
  //   //   tracks,
  //   // };
  //   return favorites;
  // }

  // async removeArtistFromFavorites(id: string): Promise<void> {
  //   const index: number = this.db.favorites.artists.findIndex((i) => i === id);
  //   if (index === -1) {
  //     throw new NotFoundException('Artist Is Not Favorite');
  //   } else {
  //     this.db.favorites.artists.splice(index, 1);
  //   }
  // }

  // async removeAlbumFromFavorites(id: string): Promise<void> {
  //   const index: number = this.db.favorites.albums.findIndex((i) => i === id);
  //   if (index === -1) {
  //     throw new NotFoundException('Album Is Not Favorite');
  //   } else {
  //     this.db.favorites.albums.splice(index, 1);
  //   }
  // }

  // async removeTrackFromFavorites(id: string): Promise<void> {
  //   const index: number = this.db.favorites.tracks.findIndex((i) => i === id);
  //   if (index === -1) {
  //     throw new NotFoundException('Track Is Not Favorite');
  //   } else {
  //     this.db.favorites.tracks.splice(index, 1);
  //   }
  // }
}