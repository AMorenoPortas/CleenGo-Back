// src/chat/dto/create-chat-message.dto.ts

import { IsUUID, IsString, MinLength } from 'class-validator';

export class CreateChatMessageDto {
  @IsUUID()
  appointmentId: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  @MinLength(1)
  content: string;
}
