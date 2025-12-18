import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DashboardCacheService } from 'src/Dashboard/dashboard-cache.service';
import { DashboardCronService } from 'src/Dashboard/dashboard-cron.service';
import { Provider } from 'src/provider/entities/provider.entity';
import { Suscription } from 'src/suscription/entities/suscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Provider, Suscription])],
  controllers: [AdminController],
  providers: [AdminService, DashboardCronService, DashboardCacheService],
})
export class AdminModule {}
