import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnicianDto {
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
    description: 'User ID associated with the technician',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
