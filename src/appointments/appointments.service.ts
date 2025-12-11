import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
import { AppointmentStatus } from 'src/enum/appointmenStatus.enum';

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

  findAll(idAuthUser: string) {
    //busco el usuario autenticado
    const user = this.userRepository.findOne({where: {id: idAuthUser}});
    if (!user) throw new BadRequestException('⚠️ User not found');

    //traigo todas las appointments a su nombre
    const appointments = this.appointmentRepository.find({where: {clientId: user, }});
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto, idAuthUser:string) {

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
    ;
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
