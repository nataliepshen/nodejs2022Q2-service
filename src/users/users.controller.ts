import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.usersService.remove(id);
  }
}
