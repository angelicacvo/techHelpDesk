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

  // Create a technician profile (validates user exists and has TECHNICIAN role)
  async create(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
    const user = await this.userRepository.findOne({
      where: { email: createTechnicianDto.userEmail },
    });

    if (!user) {
      throw new NotFoundException('User not found with that email');
    }

    if (user.role !== UserRole.TECHNICIAN) {
      throw new BadRequestException('User must have TECHNICIAN role');
    }

    const existingTechnician = await this.technicianRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingTechnician) {
      throw new BadRequestException(
        'A technician profile already exists for this user',
      );
    }

    const technician = this.technicianRepository.create({
      name: createTechnicianDto.name,
      specialty: createTechnicianDto.specialty,
      availability: createTechnicianDto.availability,
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

    if (
      updateTechnicianDto.userId &&
      updateTechnicianDto.userId !== technician.user.id
    ) {
      const user = await this.userRepository.findOne({
        where: { id: updateTechnicianDto.userId },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (user.role !== UserRole.TECHNICIAN) {
        throw new BadRequestException('El usuario debe tener rol TECHNICIAN');
      }

      technician.user = user;
    }

    Object.assign(technician, updateTechnicianDto);
    return await this.technicianRepository.save(technician);
  }

  async remove(id: string): Promise<void> {
    const technician = await this.findOne(id);
    await this.technicianRepository.remove(technician);
  }
}
