import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { TicketStatus } from '../enums/ticket-status.enum';

@Injectable()
export class TechnicianWorkloadValidator {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async validateWorkload(technicianId: string): Promise<void> {
    const inProgressCount = await this.ticketRepository.count({
      where: {
        technician: { id: technicianId },
        status: TicketStatus.IN_PROGRESS,
      },
    });

    if (inProgressCount >= 5) {
      throw new BadRequestException(
        `El técnico ha alcanzado el límite máximo de 5 tickets en progreso (actualmente tiene ${inProgressCount})`
      );
    }
  }
}
