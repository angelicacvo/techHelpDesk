import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

/**
 * Custom validator to verify that a client exists in the database
 * Used with class-validator in DTOs via @Validate(ClientExistsValidator)
 * Example: @Validate(ClientExistsValidator) clientId: string;
 */
@ValidatorConstraint({ name: 'ClientExists', async: true })
@Injectable()
export class ClientExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  // Verifies in the database if the client exists
  async validate(clientId: string): Promise<boolean> {
    if (!clientId) return false;

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    return !!client;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Client with ID ${args.value} does not exist`;
  }
}
