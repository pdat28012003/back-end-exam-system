import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

async function resetAdmin() {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-system';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Đã kết nối đến MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Xóa tất cả người dùng có vai trò admin
    const deleteResult = await usersCollection.deleteMany({ role: 'admin' });
    console.log(`Đã xóa ${deleteResult.deletedCount} tài khoản admin`);

    // Tạo tài khoản admin mới
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Tạo tài khoản admin mới
    const admin = {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Administrator',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await usersCollection.insertOne(admin);
    console.log(
      `Đã tạo tài khoản admin mới với ID: ${insertResult.insertedId}`,
    );
    console.log(`Username: ${adminUsername}, Password: ${adminPassword}`);
  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await client.close();
    console.log('Đã đóng kết nối MongoDB');
  }
}

resetAdmin().catch(console.error);
