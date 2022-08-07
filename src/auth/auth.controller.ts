import { Controller, Post, Body, HttpCode, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(201)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  refreshTokens(@Body() { refreshToken }: { refreshToken: string }) {
      if (!refreshToken) throw new ForbiddenException('Refresh token has not been transferred');
      return this.authService.refreshTokens(refreshToken);
  }
}
