import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, GraphqlModule, AuthModule],
  exports: [ConfigModule, GraphqlModule, AuthModule],
})
export class CommonModule {}
