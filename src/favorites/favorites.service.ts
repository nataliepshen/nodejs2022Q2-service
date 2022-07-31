import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll(): Promise<any> {
    return (
      (await this.prisma.favorites.findFirst({
        select: {
          artists: {
            select: {
              id: true,
              name: true,
              grammy: true,
            },
          },
          albums: {
            select: {
              id: true,
              name: true,
              year: true,
              artistId: true,
            },
          },
          tracks: {
            select: {
              id: true,
              name: true,
              artistId: true,
              albumId: true,
              duration: true,
            },
          },
        },
      })) || { artists: [], albums: [], tracks: [] }
    );
  }

  async getFavoritesId(): Promise<string> {
    const favorites = await this.prisma.favorites.findMany();
    if (!favorites.length) {
      const createFavs = await this.prisma.favorites.create({
        data: {},
      });
      return createFavs.id;
    } else {
      return favorites[0].id;
    }
  }

  async addEntityToFavorites(path, id: string): Promise<string> {
    if (!validate(id)) throw new BadRequestException();
    const favsId = await this.getFavoritesId();
    const entity = await this.prisma[path].findFirst({ where: { id } });
    if (!entity) {
      throw new UnprocessableEntityException(
        `Entity with id ${id} doesn't exist`,
      );
    } else {
      await this.prisma.favorites.update({
        where: {
          id: favsId
        },
        data: {
          [`${path}s`]: {
            connect: { id: id }
          }
        }
      });
      return `Entity was successfully added to Favorites`;
    }
  }

  async removeEntityFromFavorites(path, id: string): Promise<void> {
    if (!validate(id)) throw new BadRequestException();
    const favsId = await this.getFavoritesId();
    await this.prisma.favorites.update({
      where: {
        id: favsId,
      },
      data: {
        [`${path}s`]: {
          disconnect: { id: id }
        }
      }
    });
  }
}