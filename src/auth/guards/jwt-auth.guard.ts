import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that protects routes using JWT authentication
 * Validates that the JWT token in the Authorization header is valid
 * Used with the @UseGuards(JwtAuthGuard) decorator
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
