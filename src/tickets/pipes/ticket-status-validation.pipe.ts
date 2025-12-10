import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

/**
 * Pipe that validates valid status transitions for a ticket
 * Implements the state machine:
 * - OPEN → IN_PROGRESS or CLOSED
 * - IN_PROGRESS → RESOLVED or CLOSED
 * - RESOLVED → CLOSED or IN_PROGRESS (reopening)
 * - CLOSED → no transitions allowed
 */
@Injectable()
export class TicketStatusValidationPipe implements PipeTransform {
  // Map of valid transitions from each status
  private readonly validTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
    [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
    [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS],
    [TicketStatus.CLOSED]: [],
  };

  /**
   * Validates that the status transition is allowed
   * @throws BadRequestException if the transition is not valid
   */
  transform(value: { currentStatus: TicketStatus; newStatus: TicketStatus }) {
    const { currentStatus, newStatus } = value;

    if (currentStatus === newStatus) {
      throw new BadRequestException(`Ticket is already in ${newStatus} status`);
    }

    if (currentStatus === TicketStatus.CLOSED) {
      throw new BadRequestException('Cannot change status of a closed ticket');
    }

    const allowedTransitions = this.validTransitions[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition: ${currentStatus} → ${newStatus}. ` +
          `Allowed transitions from ${currentStatus}: ${allowedTransitions.join(', ')}`,
      );
    }

    return value;
  }
}
