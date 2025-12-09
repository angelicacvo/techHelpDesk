import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersResolver } from './users/users.resolver';
import { TicketsResolver } from './tickets/tickets.resolver';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UsersResolver, TicketsResolver],
})
export class AppModule {}
