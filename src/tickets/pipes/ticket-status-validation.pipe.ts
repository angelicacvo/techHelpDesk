import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

@Injectable()
export class TicketStatusValidationPipe implements PipeTransform {
  private readonly validTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
    [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
    [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS],
    [TicketStatus.CLOSED]: [],
  };

  transform(value: { currentStatus: TicketStatus; newStatus: TicketStatus }) {
    const { currentStatus, newStatus } = value;

    if (currentStatus === newStatus) {
      throw new BadRequestException(`El ticket ya está en estado ${newStatus}`);
    }

    if (currentStatus === TicketStatus.CLOSED) {
      throw new BadRequestException('No se puede cambiar el estado de un ticket cerrado');
    }

    const allowedTransitions = this.validTransitions[currentStatus];
    
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${currentStatus} → ${newStatus}. ` +
        `Transiciones permitidas desde ${currentStatus}: ${allowedTransitions.join(', ')}`
      );
    }

    return value;
  }
}
