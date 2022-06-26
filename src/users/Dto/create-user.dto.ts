import {IsEmail, IsNotEmpty} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly surname: string;
  @IsNotEmpty()
  readonly age: number;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
