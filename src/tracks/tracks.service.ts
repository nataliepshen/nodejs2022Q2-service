import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.prisma.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track | undefined> {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
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
    await this.findOne(id);
    const updateTrack = await this.prisma.track.update({
      where: {
        id,
      },
      data: updateTrackDto,
    });
    return updateTrack;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.track.delete({
      where: {
        id,
      },
    });
  }
}
