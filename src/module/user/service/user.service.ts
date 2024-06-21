import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/src/schema/user.schema';
import { Model, Schema } from 'mongoose';
import { Response } from 'express';
import { HTTP_RESPONSE_MESSAGE } from '@/src/constants';
import { UpdateUserDto } from '@/src/dto/user/update-user.dto';
import { UpdateUserRoleDto } from '@/src/dto/user/update-user-role.dto';
import { UpdateUserPasswordDto } from '@/src/dto/user/update-user-password.dto';
import { comparePassword, hashPassword } from '@/src/utils';

@Injectable()
export class UserServices {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getDetailUserInformation(id: string, res: Response) {
    const specificUser = await this.userModel.findById(id).exec();
    if (!specificUser) {
      throw new NotFoundException({
        message: HTTP_RESPONSE_MESSAGE.USER.NOT_FOUND_USER,
      });
    }
    delete specificUser.password;
    delete specificUser.role;

    const specificUserRes = {
      _id: specificUser._id,
      userName: specificUser.userName,
      email: specificUser.email,
      gender: specificUser.gender,
      role: specificUser.role,
      phoneNumber: specificUser.phoneNumber,
      dateOfBirth: specificUser.dateOfBirth,
    };
    return res.json({ ...specificUserRes });
  }

  async updateUserInformation(id: string, dto: UpdateUserDto, res: Response) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { ...dto, updatedAt: new Date().toISOString() },
        { new: true },
      )
      .exec();
    const response = updatedUser.toObject();
    return res.json({ ...response });
  }

  async updateUserRoleInformation(
    id: string,
    dto: UpdateUserRoleDto,
    res: Response,
  ) {}

  async updateUserPassword(dto: UpdateUserPasswordDto, res: Response) {
    const { currentPassword, newPassword, userId } = dto;

    const specificUser = await this.userModel.findById(userId).exec();
    const specificUserPassword = specificUser?.password || '';
    const comparePasswordResult = await comparePassword(
      specificUserPassword,
      currentPassword,
    );

    if (!specificUser || !comparePasswordResult) {
      throw new BadRequestException({
        message:
          HTTP_RESPONSE_MESSAGE.FORGET_RESET_PASSWORD.WRONG_CURRENT_PASSWORD,
      });
    } else {
      const compareNewPasswordResult = await comparePassword(
        specificUserPassword,
        newPassword,
      );

      if (compareNewPasswordResult) {
        throw new BadRequestException({
          message:
            HTTP_RESPONSE_MESSAGE.FORGET_RESET_PASSWORD
              .DUPLICATE_NEW_CURRENT_PASSWORD,
        });
      } else {
        const hashedPassword = await hashPassword(newPassword);
        await this.userModel
          .findByIdAndUpdate(
            userId,
            { password: hashedPassword, updatedAt: new Date().toISOString() },
            { new: true },
          )
          .exec();

        return res.json({
          message: HTTP_RESPONSE_MESSAGE.USER.UPDATE_PASSWORD_SUCCESS,
        });
      }
    }
  }
}
