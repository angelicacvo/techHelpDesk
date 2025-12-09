import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class UpdateTicketStatusDto {
  @ApiProperty({
    description: 'New ticket status (must follow sequence: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED)',
    enum: TicketStatus,
    example: TicketStatus.IN_PROGRESS,
  })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;
}
