import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength, Validate } from 'class-validator';
import { TicketPriority } from '../../common/enums/ticket-priority.enum';
import { CategoryExistsValidator } from '../../common/validators/category-exists.validator';
import { ClientExistsValidator } from '../../common/validators/client-exists.validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsUUID()
  @IsNotEmpty()
  @Validate(CategoryExistsValidator)
  categoryId: string;

  @IsUUID()
  @IsNotEmpty()
  @Validate(ClientExistsValidator)
  clientId: string;

  @IsUUID()
  @IsOptional()
  technicianId?: string;
}
