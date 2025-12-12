import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  // Crear y guardar un nuevo mensaje de chat ligado a una cita
  async createMessage(params: {
    appointmentId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) {
    const { appointmentId, senderId, receiverId, content } = params;

    const newMessage = this.chatMessageRepository.create({
      content,
      appointment: { id: appointmentId } as any,
      sender: { id: senderId } as any,
      receiver: { id: receiverId } as any,
    });

    return this.chatMessageRepository.save(newMessage);
  }

  // Obtener el historia de mensajes para una cita ordenado del más antiguo al más reciente

  async getMessagesByAppointment(appointmentId: string) {
    return this.chatMessageRepository.find({
      where: { appointment: { id: appointmentId } },
      relations: ['sender', 'receiver', 'appointment'],
      order: { createdAt: 'ASC' },
    });
  }
}
