import {IsEmail} from "class-validator";

export class UpdateUserDto {
  readonly name: string;
  readonly surname: string;
  readonly age: number;
  @IsEmail()
  readonly email: string;
  readonly password: string;
}
