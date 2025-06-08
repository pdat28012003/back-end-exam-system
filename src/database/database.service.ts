import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    try {
      // Kiểm tra kết nối bằng cách đếm số lượng người dùng
      const count = await this.userModel.countDocuments().exec();
      this.logger.log(
        `Kết nối MongoDB thành công. Số lượng người dùng hiện tại: ${count}`,
      );

      // Kiểm tra xem đã có admin chưa, nếu chưa thì tạo một tài khoản admin mặc định
      const adminExists = await this.userModel
        .findOne({ role: UserRole.ADMIN })
        .exec();

      if (!adminExists) {
        const admin = new this.userModel({
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123', // Trong thực tế, bạn nên mã hóa mật khẩu
          fullName: 'Administrator',
          role: UserRole.ADMIN,
        });

        await admin.save();
        this.logger.log('Đã tạo tài khoản admin mặc định');
      }
    } catch (error) {
      this.logger.error('Không thể kết nối đến MongoDB', error.stack);
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
