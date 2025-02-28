import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from './hashing/hashing.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersService: UsersService,
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await this.hashingService.hashPassword(
      signUpDto.password,
    );
    const user = await this.usersService.create({
        ...signUpDto,
        password: hashedPassword,
    })

    // generate JWT token
    return user;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
        where: { email: signInDto.email },
    })
    if (!user) {
        throw new UnauthorizedException('This email is not registered');
    }

    const isPasswordMatching = await this.hashingService.comparePassword(signInDto.password, user.password);
    if (!isPasswordMatching) {
        throw new UnauthorizedException('Password is incorrect');
    }

    // generate JWT token
    return user;
  }
}
