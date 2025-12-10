import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnicianDto {
  @ApiProperty({
    description: 'Full name of the technician',
    example: 'Ana Martinez',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Email address (will also be used as login email)',
    example: 'ana.martinez@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Technician specialty',
    example: 'Network Infrastructure',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  specialty: string;

  @ApiPropertyOptional({
    description: 'Technician availability for assignments',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @ApiProperty({
    description: 'Password for the technician user account',
    example: 'Tech123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
