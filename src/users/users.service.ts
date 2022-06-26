import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from './users.schema';
import {Model} from 'mongoose';
import {CreateUserDto} from './Dto/create-user.dto';
import {UpdateUserDto} from './Dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await new this.userModel(userDto);
      return await createdUser.save();
    } catch (e) {
      throw new HttpException(e, 400);
    }
  }

  async updateUser(userId: string, userDto: UpdateUserDto): Promise<User> {
    const updatedUser: User = await this.userModel
      .findByIdAndUpdate(userId, userDto)
      .setOptions({ new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('Пользователя не найдено');
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<User> {
    const deletedUser: User = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new NotFoundException('Пользователя не найдено');
    }
    return deletedUser;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this.userModel.find();
    if (!users || users.length === 0) {
      throw new NotFoundException('Пользователей не найдено');
    }
    return users;
  }

  async getOne(userId: string): Promise<User> {
    const user: User = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Не найдено');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({email: email});
  }
}
