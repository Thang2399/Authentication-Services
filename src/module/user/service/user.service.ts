import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserServices {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
}
