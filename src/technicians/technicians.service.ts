import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
    const user = await this.userRepository.findOne({
      where: { id: createTechnicianDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.role !== UserRole.TECHNICIAN) {
      throw new BadRequestException('El usuario debe tener rol TECHNICIAN');
    }

    const existingTechnician = await this.technicianRepository.findOne({
      where: { user: { id: createTechnicianDto.userId } },
    });

    if (existingTechnician) {
      throw new BadRequestException('Ya existe un perfil de técnico para este usuario');
    }

    const technician = this.technicianRepository.create({
      ...createTechnicianDto,
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
      throw new NotFoundException(`Técnico con ID ${id} no encontrado`);
    }

    return technician;
  }

  async update(id: string, updateTechnicianDto: UpdateTechnicianDto): Promise<Technician> {
    const technician = await this.findOne(id);

    if (updateTechnicianDto.userId && updateTechnicianDto.userId !== technician.user.id) {
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
