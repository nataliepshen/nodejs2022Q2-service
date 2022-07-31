import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { InMemoryDB } from 'src/db/db';

@Injectable()
export class UsersService {
  constructor(private db: InMemoryDB) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: User = {
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: +Date.now(),
      updatedAt: +Date.now(),
    };
    const newUser = new User(data);
    this.db.users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.db.users;
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    } else {
      return user;
    }
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Wrong old password');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = +Date.now();
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    } else {
      this.db.users = this.db.users.filter((u) => u.id !== id);
    }
  }
}
