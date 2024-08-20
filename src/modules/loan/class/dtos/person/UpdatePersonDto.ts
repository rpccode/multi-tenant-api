import { IsOptional, IsInt, IsString, IsBoolean, IsEmail, Length } from 'class-validator';

export class UpdatePersonDto {
  @IsOptional()
  @IsInt()
  personType_id?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  typeDni?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  dni?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  last_name?: string;

  @IsOptional()
  @IsInt()
  address?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 50)
  email?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsBoolean()
  state?: boolean;

  @IsOptional()
  id: string;
}
