import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';
import { CategoryExistsValidator } from '../common/validators/category-exists.validator';
import { ClientExistsValidator } from '../common/validators/client-exists.validator';
import { TechnicianWorkloadValidator } from '../common/validators/technician-workload.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Category, Client, Technician])],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    CategoryExistsValidator,
    ClientExistsValidator,
    TechnicianWorkloadValidator,
  ],
})
export class TicketsModule {}
