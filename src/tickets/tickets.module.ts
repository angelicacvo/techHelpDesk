import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Category, Client, Technician])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
