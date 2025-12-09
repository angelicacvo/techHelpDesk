import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/currentuser.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register new user',
    description: 'Creates a new user account in the system with the specified role'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Juan Perez',
          email: 'juan.perez@example.com',
          role: 'CLIENT'
        },
        message: 'Resource created successfully'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid data or email already registered' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Login',
    description: 'Authenticates a user and returns a JWT token'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        success: true,
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Admin User',
            email: 'admin@techhelpdesk.com',
            role: 'ADMIN'
          }
        },
        message: 'Request processed successfully'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get authenticated user profile',
    description: 'Returns current user information based on JWT token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          message: 'User profile',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Admin User',
            email: 'admin@techhelpdesk.com',
            role: 'ADMIN'
          }
        },
        message: 'Request processed successfully'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getProfile(@CurrentUser() user: User) {
    return {
      message: 'User profile',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

