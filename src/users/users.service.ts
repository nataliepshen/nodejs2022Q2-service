import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/db/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      }
    })
    return plainToInstance(User, user);
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });
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
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.findOne(id);
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Wrong old password');
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        password: newPassword,
        updatedAt: new Date(),
        version: user.version + 1,
      }
    })
    return plainToInstance(User, updateUser);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: {
        id
      }
    });
  }
}
