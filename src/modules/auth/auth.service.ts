import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userEmail: string, userPassword: string): Promise<any> {
    const user = await this.userService.findOneByEmail(userEmail);
    if (!user) {
      return null;
    }
    if (!(await bcrypt.compare(userPassword, user.password))) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      is_admin: user.is_admin,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      avatar: registerDto.avatar,
    });
    return newUser;
  }
}
