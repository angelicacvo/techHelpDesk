import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateTechnicianDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  specialty: string;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
