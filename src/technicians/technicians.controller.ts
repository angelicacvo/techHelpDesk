import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

/**
 * Controller that handles technician profile endpoints
 * All operations require ADMIN role
 */
@ApiTags('Technicians')
@ApiBearerAuth('JWT-auth')
@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @ApiOperation({ summary: 'Create a new technician (Admin only)' })
  @ApiResponse({ status: 201, description: 'Technician successfully created' })
  @ApiResponse({ status: 400, description: 'User already has a technician profile or invalid role' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.techniciansService.create(createTechnicianDto);
  }

  @ApiOperation({ summary: 'Get all technicians (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all technicians' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.techniciansService.findAll();
  }

  @ApiOperation({ summary: 'Get technician by ID' })
  @ApiParam({ name: 'id', description: 'Technician UUID' })
  @ApiResponse({ status: 200, description: 'Technician found' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.techniciansService.findOne(id);
  }

  @ApiOperation({ summary: 'Update technician (Admin only)' })
  @ApiParam({ name: 'id', description: 'Technician UUID' })
  @ApiResponse({ status: 200, description: 'Technician successfully updated' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
    return this.techniciansService.update(id, updateTechnicianDto);
  }

  @ApiOperation({ summary: 'Delete technician (Admin only)' })
  @ApiParam({ name: 'id', description: 'Technician UUID' })
  @ApiResponse({ status: 200, description: 'Technician successfully deleted' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techniciansService.remove(id);
  }
}
