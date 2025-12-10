import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

/**
 * Service that handles CRUD operations for client profiles
 * Links users with CLIENT role to their client details
 */
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a client profile and associated user account (Admin creates both at once)
  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createClientDto.contactEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create the user first
    const user = this.userRepository.create({
      name: createClientDto.name,
      email: createClientDto.contactEmail,
      password: createClientDto.password,
      role: UserRole.CLIENT,
    });

    await this.userRepository.save(user);

    // Create the client profile
    const client = this.clientRepository.create({
      name: createClientDto.name,
      contactEmail: createClientDto.contactEmail,
      company: createClientDto.company,
      user,
    });

    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
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

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
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

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    if (updateClientDto.userEmail && updateClientDto.userEmail !== client.user.email) {
      const user = await this.userRepository.findOne({
        where: { email: updateClientDto.userEmail },
      });

      if (!user) {
        throw new NotFoundException('User not found with that email');
      }

      if (user.role !== UserRole.CLIENT) {
        throw new BadRequestException('User must have CLIENT role');
      }

      client.user = user;
    }

    if (updateClientDto.name) client.name = updateClientDto.name;
    if (updateClientDto.contactEmail) client.contactEmail = updateClientDto.contactEmail;
    if (updateClientDto.company !== undefined) client.company = updateClientDto.company;

    return await this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
