import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { AuthenticatedClient } from './interfaces/authenticated-client';
import { get } from 'http';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedClient;
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //* 1. Como cliente quiero ver mi perfil de usuario (dashboard)
  @Get('profile/:id')
  @Roles(Role.CLIENT, Role.ADMIN)
  getClientProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {}

  //* 2. Como cliente quiero poder modificar mis datos del perfile en el dashboard
  @Put('update-profile/:id')
  updateClientProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {}

  //* 3. Como admin quiero poder ver todos los clientes registrados y filtrarlos por nombre, email o estado (activo/inactivo).
  @Get('all-clients')
  getAllClients(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('filter') filter: string,
  ) {}

  //* 11. Como cliente quiero poder eliminar mi cuenta de usuario (módulo user).
  @Delete('delete-profile/:id')
  @Roles(Role.CLIENT, Role.ADMIN)
  deleteClientProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthenticatedRequest,
  ) {}

  //* 13. Como cliente quiero poder cambiar mi contraseña (módulo autenticación).

  //* 14. Como cliente quiero poder recuperar mi contraseña si la olvido (módulo autenticación).

  //* 15. Como cliente quiero poder cerrar sesión de manera segura (módulo de autenticación).
}
