import { IsString, IsEmail, IsBoolean, IsIn, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Male', 'Female', 'Others'])
  gender: string;

  @IsBoolean()
  loveReactFlag: boolean;
}