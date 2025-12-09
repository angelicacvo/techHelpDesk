import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@ValidatorConstraint({ name: 'ClientExists', async: true })
@Injectable()
export class ClientExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async validate(clientId: string): Promise<boolean> {
    if (!clientId) return false;
    
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    
    return !!client;
  }

  defaultMessage(args: ValidationArguments): string {
    return `El cliente con ID ${args.value} no existe`;
  }
}
