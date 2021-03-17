import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Identity } from './auth.schema';
import { CreateIdentityArgs, LoginArgs } from './auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(Identity.name)
    private readonly identityModel: Model<Identity>,
  ) {}

  async onModuleInit() {
    await this.identityModel.syncIndexes();
  }

  async createToken(userId: string, email: string): Promise<string> {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET);
  }

  async login(args: LoginArgs): Promise<string> {
    const user = await this.getUserByEmail(args.email);
    return await this.createToken(String(user.userId), args.email);
  }

  async register(
    user: CreateIdentityArgs,
  ): Promise<Omit<Identity, 'password'>> {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.BCRYPT_SALT),
    );
    const createdUser = new this.identityModel(user);
    return await createdUser.save();
  }

  async getUserByEmail(email: string): Promise<Identity> {
    const user = await this.identityModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException();
    return user;
  }
}
