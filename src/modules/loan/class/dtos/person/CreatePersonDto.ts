import { IsInt, IsOptional, IsString, IsBoolean, IsEmail, Length } from 'class-validator';

export class CreatePersonDto {
  @IsInt()
  personType_id: number;

  @IsString()
  @Length(1, 10)
  typeDni: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  dni?: string;

  @IsString()
  @Length(1, 100)
  first_name: string;

  @IsString()
  @Length(1, 100)
  last_name: string;

  @IsOptional()
  @IsInt()
  address?: number;

  @IsString()
  @Length(1, 20)
  telefono: string;

  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsBoolean()
  state: boolean;
}
