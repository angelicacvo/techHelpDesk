import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../decorators/currentuser.decorator';
import { User } from '../users/entities/user.entity';

/**
 * Controller that handles ticket management endpoints
 * Different roles have different access levels:
 * - ADMIN: Full access to all tickets
 * - TECHNICIAN: Access to assigned tickets and status updates
 * - CLIENT: Can create tickets and view their own
 */
@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiOperation({ summary: 'Create a new ticket (Client or Admin)' })
  @ApiResponse({ status: 201, description: 'Ticket successfully created' })
  @ApiResponse({
    status: 400,
    description: 'Category or client not found, technician workload exceeded',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @ApiOperation({ summary: 'Get all tickets (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all tickets' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({ status: 200, description: 'Ticket found' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get tickets by client ID' })
  @ApiParam({ name: 'clientId', description: 'Client UUID' })
  @ApiResponse({ status: 200, description: 'List of tickets for the client' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.ticketsService.findByClient(clientId);
  }

  @ApiOperation({ summary: 'Get tickets by technician ID' })
  @ApiParam({ name: 'technicianId', description: 'Technician UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of tickets assigned to the technician',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('technician/:technicianId')
  findByTechnician(@Param('technicianId') technicianId: string) {
    return this.ticketsService.findByTechnician(technicianId);
  }

  @ApiOperation({ summary: 'Update ticket (Admin or assigned Technician)' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({ status: 200, description: 'Ticket successfully updated' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.update(id, updateTicketDto, user);
  }

  @ApiOperation({
    summary: 'Update ticket status (Admin or assigned Technician)',
  })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({
    status: 200,
    description: 'Ticket status successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only update assigned tickets',
  })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateTicketStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.updateStatus(id, updateStatusDto, user);
  }

  @ApiOperation({ summary: 'Delete ticket (Admin only)' })
  @ApiParam({ name: 'id', description: 'Ticket UUID' })
  @ApiResponse({ status: 200, description: 'Ticket successfully deleted' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
