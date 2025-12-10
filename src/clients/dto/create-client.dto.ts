import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Full name of the client',
    example: 'Carlos Rodriguez',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Client contact email address (will also be used as login email)',
    example: 'carlos.rodriguez@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiPropertyOptional({
    description: 'Client company name',
    example: 'Tech Solutions Inc.',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  company?: string;

  @ApiProperty({
    description: 'Password for the client user account',
    example: 'Client123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
