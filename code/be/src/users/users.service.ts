import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
  ) {}
  create(signUpDto: SignUpDto) {
    return this.userRepository.save(signUpDto);
  }

  async findAll() {
    return await this.userRepository.find({
      select: {
        id: true,
        name: true,
        role: true,
        nationality: true,
        userType: true,
      },
    });
  }

  async findOne(signUpDto: SignUpDto) {
    return await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });
  }

  public handleDeleteUser = async (userId: string) => {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user)
      throw new NotFoundException(`User With ID: '${userId}' Not Found.`);

    await this.userRepository.delete({ id: userId });

    return {
      message: 'Deleted user successfully.',
    };
  };
}
