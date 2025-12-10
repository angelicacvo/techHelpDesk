import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Client } from '../../clients/entities/client.entity';
import { Technician } from '../../technicians/entities/technician.entity';
import { Category } from '../../categories/entities/category.entity';
import { faker } from '@faker-js/faker';
import { TicketStatus } from '../../common/enums/ticket-status.enum';
import { TicketPriority } from '../../common/enums/ticket-priority.enum';

export default class TicketSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const ticketRepository = dataSource.getRepository(Ticket);
    const clientRepository = dataSource.getRepository(Client);
    const technicianRepository = dataSource.getRepository(Technician);
    const categoryRepository = dataSource.getRepository(Category);

    // Get all clients, technicians, and categories
    const clients = await clientRepository.find();
    const technicians = await technicianRepository.find();
    const categories = await categoryRepository.find();

    if (clients.length === 0 || categories.length === 0) {
      console.log('No clients or categories found. Skipping ticket seeding.');
      return;
    }

    const statuses = Object.values(TicketStatus);
    const priorities = Object.values(TicketPriority);

    console.log('Seeding tickets...');

    const ticketsToCreate: Ticket[] = [];

    // Generate 30 random tickets
    for (let i = 0; i < 30; i++) {
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      
      // 70% chance to assign a technician
      const shouldAssignTechnician = Math.random() > 0.3 && technicians.length > 0;
      const randomTechnician = shouldAssignTechnician 
        ? technicians[Math.floor(Math.random() * technicians.length)]
        : undefined;

      const ticket = ticketRepository.create({
        title: faker.helpers.arrayElement([
          'Computer not turning on',
          'Printer connection issues',
          'Software installation needed',
          'Email configuration problem',
          'Network connectivity issues',
          'Password reset request',
          'VPN access problems',
          'System running slow',
          'Application error',
          'Hardware replacement needed',
          'Data backup request',
          'Security update required',
          'File sharing permissions',
          'Monitor display issues',
          'Keyboard malfunction',
          'Mouse not working',
          'Audio problems',
          'Video conference setup',
          'Database access needed',
          'License activation issue',
        ]),
        description: faker.lorem.sentences(3),
        status: randomStatus,
        priority: randomPriority,
        client: randomClient,
        technician: randomTechnician,
        category: randomCategory,
      });

      ticketsToCreate.push(ticket);
    }

    await ticketRepository.save(ticketsToCreate);
    console.log(`Created ${ticketsToCreate.length} tickets`);
  }
}
