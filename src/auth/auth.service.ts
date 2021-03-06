import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './Dto/login.dto';
import { CreateUserDto } from '../users/Dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.schema';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto): Promise<any> {
    const candidate = await this.userService.getUserByEmail(userDto['email']);
    if (candidate) {
      throw new HttpException(
        'Пользователь с данным email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async refreshToken(token): Promise<any> {
    const email = this.jwtService.decode(token.split(' ')[1])['email']
    return this.jwtService.sign({ email });
  }

  private async generateToken(user: User): Promise<any> {
    const payload = { email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(loginDto: LoginDto): Promise<User> {
    const user: User = await this.userService.getUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Некорректный email или password');
    }
    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException('Некорректный email или password');
  }
}
