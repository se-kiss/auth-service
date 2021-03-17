import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginArgs, CreateIdentityArgs, VerifyArgs } from './auth.dto';
import { Identity } from './auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(args: LoginArgs): Promise<{ token: string }> {
    return { token: await this.authService.login(args) };
  }

  @GrpcMethod('AuthService', 'Register')
  async register(
    args: CreateIdentityArgs,
  ): Promise<Omit<Identity, 'password'>> {
    return await this.authService.register(args);
  }

  @GrpcMethod('AuthService', 'VerifyToken')
  async verifyToken(args: VerifyArgs): Promise<{ decoded: string }> {
    return { decoded: await this.authService.verifyToken(args) };
  }
}
