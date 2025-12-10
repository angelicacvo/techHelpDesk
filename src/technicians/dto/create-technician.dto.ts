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
    description: 'Technician specialty',
    example: 'Hardware Support',
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
    description: 'Email of the user to associate with this technician profile',
    example: 'technician@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;
}
