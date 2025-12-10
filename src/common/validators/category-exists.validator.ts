import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

/**
 * Custom validator to verify that a category exists in the database
 * Used with class-validator in DTOs via @Validate(CategoryExistsValidator)
 * Example: @Validate(CategoryExistsValidator) categoryId: string;
 */
@ValidatorConstraint({ name: 'CategoryExists', async: true })
@Injectable()
export class CategoryExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Verifies in the database if the category exists
  async validate(categoryId: string): Promise<boolean> {
    if (!categoryId) return false;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    return !!category;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Category with ID ${args.value} does not exist`;
  }
}
