import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async validate(categoryId: string): Promise<boolean> {
    if (!categoryId) return false;
    
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    
    return !!category;
  }

  defaultMessage(args: ValidationArguments): string {
    return `La categoría con ID ${args.value} no existe`;
  }
}
