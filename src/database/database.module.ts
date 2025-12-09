import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME') || configService.get('DB_USER'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE') || configService.get('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                ssl: {
                    rejectUnauthorized: false,
                },
            }),
            inject: [ConfigService],
        }),
    ]
})

export class DatabaseModule implements OnModuleInit {
  constructor(
    private dataSource: DataSource
  ) {}
  
  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('Database connected successfully');
    } else {
      console.log('Database connection failed');
    }
  }
}