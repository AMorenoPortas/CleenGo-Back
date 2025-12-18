import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/enum/role.enum';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Provider } from 'src/provider/entities/provider.entity';
import { Suscription } from 'src/suscription/entities/suscription.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(Provider) 
    private readonly providerRepository: Repository<Provider>,

    @InjectRepository(Suscription)
    private readonly suscriptionRepository: Repository<Suscription>,
  ){}

  //voy a agregar mas adelante
  //  providersBySubscription: [
  //   { subscriptionId: 'uuid', subscriptionName: 'Premium', count: 42 },
  //   ...
  // ],
  // Ingresos: number,
  // appointments: {
  //   total: number,
  //   pending: number,
  //   accepted: number,
  //   rejected: number
  // }

  async calculateDashboardStats() {
  const totalClients = await this.userRepository.count({ where: { role: Role.CLIENT } });
  const totalProviders = await this.userRepository.count({ where: { role: Role.PROVIDER } });
  const totalUsers = totalClients + totalProviders;

  let ingresos = 0;

  const suscriptions = await this.suscriptionRepository.find({where:{paymentStatus: true}, relations: ['plan']});

  

  suscriptions.forEach(
    (suscription) => {
      ingresos += Number(suscription.plan.price)
    }
  );

  

  return {
    totalClients,
    totalProviders,
    totalUsers,
    ingresos,
  };
}


  // create(createAdminDto: CreateAdminDto) {
  //   return 'This action adds a new admin';
  // }

  // findAll() {
  //   return `This action returns all admin`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
