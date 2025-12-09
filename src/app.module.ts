import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { TechniciansModule } from './technicians/technicians.module';

@Module({
  imports: [UsersModule, TicketsModule, CategoriesModule, ClientsModule, TechniciansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
