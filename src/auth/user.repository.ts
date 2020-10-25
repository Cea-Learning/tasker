import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";
@EntityRepository(User)

export class UserRepository extends Repository<User> {
  async signup(authCredentailsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentailsDto;

    const user = this.create();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    try {
      await user.save();
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Username already exists")
      }
      else {
        throw new InternalServerErrorException();
      }
    }
  }
  async validateUserPassword(authCredentialDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialDto;
    try {
      const user = await this.findOne({ username })
      if (user && await bcrypt.compare(password, user.password)) {
        return user.username
      }
      else return null
    }
    catch (err) {
      return null;
    }
  }

}