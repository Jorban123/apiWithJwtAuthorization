import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  Headers
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './Dto/create-user.dto';
import { UpdateUserDto } from './Dto/update-user.dto';
import { User } from './users.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly AuthService: AuthService,
  ) {}

  @Get()
  async getAll(@Headers() headers, @Res() response) {
    try {
      const users: User[] = await this.UsersService.getAll();
      return response.status(HttpStatus.OK).json({
        message: 'Пользователи найдены',
        users,
        newToken: await this.AuthService.refreshToken(headers.authorization),
      });
    } catch (e) {
      return response.status(e.status).json(e.response);
    }
  }

  @Post()
  async createUser(@Headers() headers, @Res() response, @Body() user: CreateUserDto) {
    try {
      const newUser: User = await this.UsersService.createUser(user);
      return response.status(HttpStatus.CREATED).json({
        message: 'Пользователь создан',
        newUser,
        newToken: await this.AuthService.refreshToken(headers.authorization),
      });
    } catch (e) {
      return response.status(e.status).json(e.response);
    }
  }

  @Get(':id')
  async getOne(@Headers() headers, @Res() response, @Param('id') userId: string) {
    try {
      const user: User = await this.UsersService.getOne(userId);
      return response.status(HttpStatus.OK).json({
        message: 'Пользователь найден',
        user,
        newToken: await this.AuthService.refreshToken(headers.authorization),
      });
    } catch (e) {
      return response.status(e.status).json(e.response);
    }
  }

  @Put(':id')
  async updateUser(
      @Headers() headers,
      @Res() response,
      @Param('id') userId: string,
      @Body() user: UpdateUserDto,
  ) {
    try {
      const updatedUser: User = await this.UsersService.updateUser(
        userId,
        user,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Пользователь обновлен',
        updatedUser,
        newToken: await this.AuthService.refreshToken(headers.authorization),
      });
    } catch (e) {
      return response.status(e.status).json(e.response);
    }
  }

  @Delete(':id')
  async deleteUser(@Headers() headers,@Res() response, @Param('id') userId: string) {
    try {
      const deletedUser: User = await this.UsersService.deleteUser(userId);
      return response.status(HttpStatus.OK).json({
        message: 'Пользователь удален',
        deletedUser,
        newToken: await this.AuthService.refreshToken(headers.authorization),
      });
    } catch (e) {
      return response.status(e.status).json(e.response);
    }
  }
}
