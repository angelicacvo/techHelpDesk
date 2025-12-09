import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { TicketStatus } from '../enums/ticket-status.enum';

/**
 * Validator that verifies a technician does not exceed the in-progress tickets limit
 * Business rule: Maximum 5 "in progress" tickets per technician
 * Used before assigning a new ticket or changing status to "in progress"
 */
@Injectable()
export class TechnicianWorkloadValidator {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  /**
   * Validates that the technician has fewer than 5 tickets in progress
   * @param technicianId - ID of the technician to validate
   * @throws BadRequestException if technician already has 5 or more in-progress tickets
   */
  async validateWorkload(technicianId: string): Promise<void> {
    const inProgressCount = await this.ticketRepository.count({
      where: {
        technician: { id: technicianId },
        status: TicketStatus.IN_PROGRESS,
      },
    });

    if (inProgressCount >= 5) {
      throw new BadRequestException(
        `Technician has reached the maximum limit of 5 in-progress tickets (currently has ${inProgressCount})`
      );
    }
  }
}
