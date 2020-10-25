import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from "bcryptjs";

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', async () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signup(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signup(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws a conflict exception as username already exists', async () => {
      save.mockRejectedValue({ code: '123123' }); // unhandled error code
      const result = userRepository.signup(mockCredentialsDto)
      expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(async () => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUsername';
      user.password =  await bcrypt.hash("TestPassword",10)
    });

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual('TestUsername');
    });

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      user.password = await bcrypt.hash("AnotherPassword",10)
      userRepository.findOne.mockResolvedValue(user);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toBeNull();
  });
});
});