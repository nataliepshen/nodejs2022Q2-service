import { Controller, Get, Post, Param, Delete, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbum(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.favoritesService.removeArtistFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.favoritesService.removeTrackFromFavorites(id);
  }
}
