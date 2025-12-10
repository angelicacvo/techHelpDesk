import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority } from '../../common/enums/ticket-priority.enum';
import { CategoryExistsValidator } from '../../common/validators/category-exists.validator';
import { ClientExistsValidator } from '../../common/validators/client-exists.validator';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Ticket title',
    example: 'Office 203 monitor not working',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the issue',
    example:
      'The monitor in office 203 does not turn on, power cable has been checked and it still does not work',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Ticket priority',
    enum: TicketPriority,
    example: TicketPriority.MEDIUM,
    default: TicketPriority.MEDIUM,
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({
    description: 'Ticket category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  @Validate(CategoryExistsValidator)
  categoryId: string;

  @ApiProperty({
    description: 'ID of the client reporting the ticket',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  @Validate(ClientExistsValidator)
  clientId: string;

  @ApiPropertyOptional({
    description: 'ID of the assigned technician (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  technicianId?: string;
}
