// src/chat/chat.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @ApiOperation({
    summary: 'Crear un mensaje de chat entre cliente y proveedor',
    description:
      'Crea un mensaje ligado a una cita específica. Más adelante el senderId saldrá del usuario autenticado.',
  })
  @ApiBody({ type: CreateChatMessageDto })
  async createMessage(@Body() body: CreateChatMessageDto) {
    return this.chatService.createMessage(body);
  }

  @Get('messages/:appointmentId')
  @ApiOperation({
    summary: 'Obtener historial de mensajes de una cita',
    description:
      'Devuelve todos los mensajes asociados a una cita, ordenados del más antiguo al más reciente.',
  })
  @ApiParam({
    name: 'appointmentId',
    description: 'UUID de la cita (appointment) relacionada al chat',
    type: String,
  })
  async getMessagesByAppointment(
    @Param('appointmentId', new ParseUUIDPipe()) appointmentId: string,
  ) {
    return this.chatService.getMessagesByAppointment(appointmentId);
  }
}
