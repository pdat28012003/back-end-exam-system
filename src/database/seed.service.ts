import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    try {
      // Kiểm tra xem đã có admin chưa
      const adminExists = await this.userModel.findOne({ role: UserRole.ADMIN }).exec();
      
      if (adminExists) {
        this.logger.log('Tài khoản admin đã tồn tại, bỏ qua việc tạo tài khoản mặc định');
        return;
      }

      // Lấy thông tin admin từ biến môi trường hoặc sử dụng giá trị mặc định
      const adminUsername = this.configService.get<string>('ADMIN_USERNAME') || 'admin';
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@example.com';
      
      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Tạo tài khoản admin mặc định
      const admin = new this.userModel({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Administrator',
        role: UserRole.ADMIN,
        isActive: true,
      });

      await admin.save();
      this.logger.log('Đã tạo tài khoản admin mặc định thành công');
    } catch (error) {
      this.logger.error('Lỗi khi tạo tài khoản admin mặc định:', error);
    }
  }
}