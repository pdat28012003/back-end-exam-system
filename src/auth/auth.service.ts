import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '../database/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa');
    }

    // Cập nhật thời gian đăng nhập cuối cùng
    const now = new Date();

    // Sử dụng Document.id thay vì _id để lấy id dưới dạng string
    const userId = user.id;

    // Cập nhật thời gian đăng nhập cuối cùng trong cơ sở dữ liệu
    await this.usersService.update(userId, { lastLogin: now });

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastLogin: now,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, password, fullName, role } = registerDto;

    // Kiểm tra xem username đã tồn tại chưa
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || UserRole.STUDENT, // Mặc định là học sinh
      isActive: true,
    });

    return newUser;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.usersService.findById(userId);

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await this.usersService.update(userId, { password: hashedNewPassword });

    return true;
  }
}
