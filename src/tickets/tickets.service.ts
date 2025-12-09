import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';
import { TicketStatus } from '../common/enums/ticket-status.enum';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const category = await this.categoryRepository.findOne({
      where: { id: createTicketDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const client = await this.clientRepository.findOne({
      where: { id: createTicketDto.clientId },
    });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    let technician: Technician | undefined = undefined;
    if (createTicketDto.technicianId) {
      const foundTechnician = await this.technicianRepository.findOne({
        where: { id: createTicketDto.technicianId },
      });
      if (!foundTechnician) {
        throw new NotFoundException('Técnico no encontrado');
      }

      await this.validateTechnicianWorkload(createTicketDto.technicianId);
      technician = foundTechnician;
    }

    const ticket = this.ticketRepository.create({
      title: createTicketDto.title,
      description: createTicketDto.description,
      priority: createTicketDto.priority,
      category,
      client,
      technician,
      status: TicketStatus.OPEN,
    });

    return await this.ticketRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      relations: ['category', 'client', 'technician', 'client.user', 'technician.user'],
    });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['category', 'client', 'technician', 'client.user', 'technician.user'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }

    return ticket;
  }

  async findByClient(clientId: string): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: { client: { id: clientId } },
      relations: ['category', 'client', 'technician', 'technician.user'],
    });
  }

  async findByTechnician(technicianId: string): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: { technician: { id: technicianId } },
      relations: ['category', 'client', 'technician', 'client.user'],
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, user: User): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (updateTicketDto.categoryId && updateTicketDto.categoryId !== ticket.category.id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateTicketDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
      ticket.category = category;
    }

    if (updateTicketDto.technicianId) {
      if (updateTicketDto.technicianId !== ticket.technician?.id) {
        const technician = await this.technicianRepository.findOne({
          where: { id: updateTicketDto.technicianId },
        });
        if (!technician) {
          throw new NotFoundException('Técnico no encontrado');
        }

        await this.validateTechnicianWorkload(updateTicketDto.technicianId);
        ticket.technician = technician;
      }
    }

    Object.assign(ticket, updateTicketDto);
    return await this.ticketRepository.save(ticket);
  }

  async updateStatus(id: string, updateStatusDto: UpdateTicketStatusDto, user: User): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (user.role === UserRole.TECHNICIAN) {
      if (!ticket.technician || ticket.technician.user.id !== user.id) {
        throw new ForbiddenException('Solo puedes actualizar tickets asignados a ti');
      }
    }

    this.validateStatusTransition(ticket.status, updateStatusDto.status);

    ticket.status = updateStatusDto.status;
    return await this.ticketRepository.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket);
  }

  private validateStatusTransition(currentStatus: TicketStatus, newStatus: TicketStatus): void {
    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
      [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
      [TicketStatus.RESOLVED]: [TicketStatus.CLOSED, TicketStatus.IN_PROGRESS],
      [TicketStatus.CLOSED]: [],
    };

    if (currentStatus === newStatus) {
      throw new BadRequestException(`El ticket ya está en estado ${newStatus}`);
    }

    if (currentStatus === TicketStatus.CLOSED) {
      throw new BadRequestException('No se puede cambiar el estado de un ticket cerrado');
    }

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${currentStatus} → ${newStatus}. ` +
        `Transiciones permitidas desde ${currentStatus}: ${allowedTransitions.join(', ')}`
      );
    }
  }

  private async validateTechnicianWorkload(technicianId: string): Promise<void> {
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
