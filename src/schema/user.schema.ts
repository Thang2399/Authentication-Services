import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender_Enum, User_Role_Enum } from '@/src/shared/enum/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userName: string;

  @Prop()
  email: string;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: Gender_Enum.MALE, enum: Object.values(Gender_Enum) })
  gender: string;

  @Prop({ default: User_Role_Enum.USER, enum: Object.values(User_Role_Enum) })
  role: string;

  @Prop({ default: new Date().toLocaleString().split(',')[0] })
  dateOfBirth: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: new Date().toISOString() }) // Set the default value to the current ISO date and time
  createdAt?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
