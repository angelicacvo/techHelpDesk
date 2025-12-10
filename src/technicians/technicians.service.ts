import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

/**
 * Service that handles CRUD operations for technician profiles
 * Links users with TECHNICIAN role to their technical details and specialties
 */
@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a technician profile and associated user account (Admin creates both at once)
  async create(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createTechnicianDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create the user first
    const user = this.userRepository.create({
      name: createTechnicianDto.name,
      email: createTechnicianDto.email,
      password: createTechnicianDto.password,
      role: UserRole.TECHNICIAN,
    });

    await this.userRepository.save(user);

    // Create the technician profile
    const technician = this.technicianRepository.create({
      name: createTechnicianDto.name,
      specialty: createTechnicianDto.specialty,
      availability: createTechnicianDto.availability ?? true,
      user,
    });

    return await this.technicianRepository.save(technician);
  }

  async findAll(): Promise<Technician[]> {
    return await this.technicianRepository.find({
      relations: ['user', 'tickets'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Technician> {
    const technician = await this.technicianRepository.findOne({
      where: { id },
      relations: ['user', 'tickets'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    });

    if (!technician) {
      throw new NotFoundException(`Technician with ID ${id} not found`);
    }

    return technician;
  }

  async update(
    id: string,
    updateTechnicianDto: UpdateTechnicianDto,
  ): Promise<Technician> {
    const technician = await this.findOne(id);

    if (updateTechnicianDto.name) technician.name = updateTechnicianDto.name;
    if (updateTechnicianDto.specialty !== undefined) technician.specialty = updateTechnicianDto.specialty;
    if (updateTechnicianDto.availability !== undefined) technician.availability = updateTechnicianDto.availability;

    return await this.technicianRepository.save(technician);
  }

  async remove(id: string): Promise<void> {
    const technician = await this.findOne(id);
    await this.technicianRepository.remove(technician);
  }
}
