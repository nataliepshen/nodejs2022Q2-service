import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put, HttpCode } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.albumsService.remove(id);
  }
}
