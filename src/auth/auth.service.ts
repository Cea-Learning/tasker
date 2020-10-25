import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './dto/auth-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService : JwtService,
  ){}

  async signup(authcredentialsDto: AuthCredentialsDto): Promise<void>{
    return await this.userRepository.signup(authcredentialsDto);
  }
  async signIn(authcredentialsDto: AuthCredentialsDto): Promise<{accesstoken: string}>{
    const username = await this.userRepository.validateUserPassword(authcredentialsDto);
    if(!username){
      throw new UnauthorizedException("Invalid Crendetials");
    }
    const payload: JwtPayload = {username};
    const accesstoken = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token with payload`)
    return { accesstoken };
  }
}
