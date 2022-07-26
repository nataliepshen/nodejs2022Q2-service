import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(
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
  }
}
