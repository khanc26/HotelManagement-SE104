import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
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

  // findAll() {
  //   return `This action returns all users`;
  // }

  async findOne(signUpDto: SignUpDto) {
    return await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    })
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
