import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.artistsService.remove(id);
  }
}
