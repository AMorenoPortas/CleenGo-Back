import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
import { AppointmentStatus } from 'src/enum/appointmenStatus.enum';
import { filterAppointmentDto } from './dto/filter-appointment.dto';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment';
  }

  async findAllUserAppointments(authUser:any, filters:filterAppointmentDto) {
    //busco el usuario autenticado
    const user = await this.userRepository.findOne({where: {id: authUser.sub}});
    if (!user) throw new BadRequestException('⚠️ User not found');

    console.log(filters);

    //traigo todas las appointments
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.clientId', 'users')
      .leftJoinAndSelect('appointment.providerId', 'users')
      .leftJoinAndSelect('appointment.serviceId', 'service')
      .leftJoinAndSelect('appointment.serviceId.categoryId', 'category');

      //filtro usando el usurio autenticado
    if (authUser.rol === Role.CLIENT) {
      query.where('client.userId = :user', { user: user });
    } else if (authUser.rol === Role.PROVIDER) {
      query.where('provider.userId = :user', { user: user });
    }
    
    //preparo la query para filtrar usando los filtros de busqueda
    if (filters.status) {
      query.andWhere('appointment.status = :status', {
        status: filters.status,
      });
    }

    if (filters.category) {
      query.andWhere('service.categoryId.name = :category', {
        category: filters.category,
      });
    }

    //el filtro por proveedor contratado que solo sera para el cliente
    if (filters.provider) {
      query.andWhere('providerId.name = :provider', {
        provider: filters.provider,
      });
    }

    //el filtro por cliente es solo para el proveedor
    if (filters.client) {
      query.andWhere('clientId.name = :client', {
        client: filters.client,
      });
    }

    //el filtro por fecha
    if (filters.date) {
      query.andWhere('appointment.date = :date', {
        date: filters.date,
      });
    }

    query.orderBy('appointment.AppointmentDate', 'DESC');

    const appointments: Appointment[] = await query.getMany();
   
  
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, idAuthUser:string) {

  
    ;
  }

  async updateStatus(id: string, status: string) {
      //traigo el appointment en cuestion y el usuario autenticado
    const appointment = await this.appointmentRepository.findOne({where: {id: id}});

    const user = await this.userRepository.findOne({where: {id: idAuthUser}});
    if (!user) throw new BadRequestException('⚠️ User not found');
    if (!appointment) throw new BadRequestException('⚠️ Appointment not found');

    if(user.role === 'client' && appointment.clientId.id !== user.id) throw new BadRequestException('⚠️ You are not the owner of this appointment');
    else if(user.role === 'client'){
      if(appointment.status === AppointmentStatus.CONFIRMEDPROVIDER || appointment.status === AppointmentStatus.COMPLETED) throw new BadRequestException('⚠️ You can not cancel this appointment');
      appointment.status = AppointmentStatus.CANCELLED;
    }

    if(user.role === 'provider' && appointment.providerId.id !== user.id) throw new BadRequestException('⚠️ You are not the owner of this appointment');
    else if(user.role === 'provider'){
      appointment.status = AppointmentStatus.REJECTED;
    }
    return this.appointmentRepository.save(appointment);


   
    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: string, authuser:string) {

    //traigo el appointment en cuestion y el usuario autenticado
    const appointment = await this.appointmentRepository.findOne({where: {id: id}});

    const user = await this.userRepository.findOne({where: {id: authuser}});
    if (!user) throw new BadRequestException('⚠️ User not found');
    if (!appointment) throw new BadRequestException('⚠️ Appointment not found');

    if(user.role === 'client' && appointment.clientId.id !== user.id) throw new BadRequestException('⚠️ You are not the owner of this appointment');
    if(user.role === 'provider' && appointment.providerId.id !== user.id) throw new BadRequestException('⚠️ You are not the owner of this appointment');

  

    return this.appointmentRepository.update(id, {isActive: false});
  

  }
}
