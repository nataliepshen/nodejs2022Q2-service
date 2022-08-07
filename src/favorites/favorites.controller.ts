import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':path/:id')
  @HttpCode(201)
  async add(@Param() { path, id }) {
    return await this.favoritesService.addEntityToFavorites(path, id);
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Delete(':path/:id')
  @HttpCode(204)
  async removeArtist(@Param() { path, id }) {
    return await this.favoritesService.removeEntityFromFavorites(path, id);
  }
}
