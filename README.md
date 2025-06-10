# Hệ Thống Thi Trực Tuyến - Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

Hệ thống thi trực tuyến được xây dựng bằng NestJS, MongoDB và JWT, cung cấp nền tảng quản lý bài thi, câu hỏi, người dùng và bài nộp.

## Tổng Quan

Hệ thống thi trực tuyến là một ứng dụng backend cung cấp API cho việc quản lý và thực hiện các bài thi trực tuyến. Hệ thống hỗ trợ nhiều loại người dùng (admin, giáo viên, học sinh), nhiều loại câu hỏi và cung cấp các tính năng như tạo bài thi, quản lý câu hỏi, làm bài thi và chấm điểm tự động.

## Công Nghệ Sử Dụng

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT (JSON Web Token)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator và class-transformer
- **Security**: Helmet

## Cấu Trúc Dự Án

```
src/
├── auth/                  # Xác thực và phân quyền
│   ├── decorators/        # Custom decorators
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # Guards bảo vệ routes
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts # Controller xử lý auth
│   ├── auth.module.ts     # Module auth
│   └── auth.service.ts    # Service xử lý logic auth
├── common/                # Các thành phần dùng chung
│   ├── filters/           # Exception filters
│   └── interceptors/      # Interceptors
├── database/              # Cấu hình và schema database
│   ├── schemas/           # Mongoose schemas
│   ├── database.service.ts # Service database
│   ├── mongodb.config.ts  # Cấu hình MongoDB
│   └── seed.service.ts    # Service khởi tạo dữ liệu
├── exam-statistics/       # Module thống kê bài thi
├── exams/                 # Module quản lý bài thi
│   ├── dto/               # DTOs cho bài thi
│   ├── exams.controller.ts # Controller bài thi
│   ├── exams.module.ts    # Module bài thi
│   └── exams.service.ts   # Service xử lý logic bài thi
├── notifications/         # Module quản lý thông báo
├── questions/             # Module quản lý câu hỏi
├── scripts/               # Scripts tiện ích
├── submissions/           # Module quản lý bài nộp
├── swagger/               # Cấu hình Swagger
│   ├── models/            # Models cho Swagger
│   └── index.ts           # Cấu hình Swagger
├── users/                 # Module quản lý người dùng
│   ├── dto/               # DTOs cho người dùng
│   ├── admin-users.controller.ts # Controller admin
│   ├── users.controller.ts # Controller người dùng
│   ├── users.module.ts    # Module người dùng
│   └── users.service.ts   # Service xử lý logic người dùng
├── app.controller.ts      # Controller chính
├── app.module.ts          # Module chính
├── app.service.ts         # Service chính
└── main.ts                # Entry point
```

## Luồng Xử Lý Logic (Flow)

### 1. Khởi động ứng dụng

Khi ứng dụng khởi động (trong file `main.ts`):

1. Khởi tạo ứng dụng NestJS
2. Cấu hình CORS, Helmet và các middleware bảo mật
3. Thiết lập global prefix cho API (`/api`)
4. Cấu hình Validation Pipe để xác thực dữ liệu đầu vào
5. Cấu hình Transform Interceptor để định dạng response
6. Cấu hình Exception Filter để xử lý lỗi
7. Cấu hình Swagger để tạo tài liệu API
8. Khởi động server và lắng nghe trên cổng đã cấu hình

### 2. Xác thực và phân quyền

Luồng xác thực:

1. Người dùng gửi thông tin đăng nhập đến `/api/auth/login`
2. `AuthController` nhận request và chuyển cho `AuthService`
3. `AuthService` kiểm tra thông tin đăng nhập với `UsersService`
4. Nếu hợp lệ, tạo JWT token và trả về cho người dùng
5. Người dùng sử dụng token này trong header `Authorization` cho các request tiếp theo
6. `JwtStrategy` và `JwtGuard` xác thực token và trích xuất thông tin người dùng
7. `RolesGuard` kiểm tra quyền của người dùng dựa trên role

### 3. Quản lý người dùng

Luồng quản lý người dùng:

1. Admin tạo tài khoản người dùng qua `/api/admin/users`
2. Người dùng có thể cập nhật thông tin cá nhân qua `/api/users/profile`
3. Admin có thể xem, cập nhật, vô hiệu hóa tài khoản người dùng

### 4. Quản lý bài thi

Luồng tạo và quản lý bài thi:

1. Giáo viên tạo bài thi mới qua `/api/exams`
2. Giáo viên thêm câu hỏi vào bài thi qua `/api/questions`
3. Giáo viên cập nhật trạng thái bài thi (draft, published, active, completed, archived)
4. Học sinh có thể xem danh sách bài thi đang hoạt động

### 5. Làm bài thi và nộp bài

Luồng làm bài thi:

1. Học sinh bắt đầu làm bài thi qua `/api/submissions/start`
2. Hệ thống tạo một bản ghi submission với trạng thái "in_progress"
3. Học sinh trả lời câu hỏi và gửi câu trả lời qua `/api/submissions`
4. Khi hoàn thành, học sinh nộp bài qua `/api/submissions/submit`
5. Hệ thống tự động chấm điểm cho các câu hỏi trắc nghiệm
6. Giáo viên chấm điểm cho các câu hỏi tự luận (nếu có)
7. Học sinh có thể xem kết quả và phản hồi

### 6. Thống kê và báo cáo

Luồng thống kê:

1. Giáo viên và admin có thể xem thống kê bài thi qua `/api/exam-statistics`
2. Hệ thống cung cấp thông tin về tỷ lệ đỗ/trượt, điểm trung bình, phân phối điểm, v.v.

## Mô Hình Dữ Liệu

### User (Người dùng)

- **username**: Tên đăng nhập
- **email**: Email
- **password**: Mật khẩu (đã hash)
- **fullName**: Họ tên đầy đủ
- **role**: Vai trò (admin, teacher, student)
- **isActive**: Trạng thái hoạt động

### Exam (Bài thi)

- **title**: Tiêu đề bài thi
- **description**: Mô tả
- **duration**: Thời gian làm bài (phút)
- **startDate**: Ngày bắt đầu
- **endDate**: Ngày kết thúc
- **status**: Trạng thái (draft, published, active, completed, archived)
- **type**: Loại bài thi (quiz, test, exam)
- **createdBy**: Người tạo (reference đến User)
- **questions**: Danh sách câu hỏi (reference đến Question)

### Question (Câu hỏi)

- **text**: Nội dung câu hỏi
- **type**: Loại câu hỏi (multiple_choice, single_choice, true_false, essay, ...)
- **options**: Các lựa chọn (đối với câu hỏi trắc nghiệm)
- **correctAnswer**: Đáp án đúng (đối với câu hỏi tự luận)
- **difficulty**: Độ khó (easy, medium, hard)
- **points**: Điểm số
- **examId**: Bài thi (reference đến Exam)
- **createdBy**: Người tạo (reference đến User)

### Submission (Bài nộp)

- **student**: Học sinh (reference đến User)
- **exam**: Bài thi (reference đến Exam)
- **status**: Trạng thái (in_progress, submitted, graded, completed)
- **answers**: Danh sách câu trả lời
- **startTime**: Thời gian bắt đầu
- **endTime**: Thời gian kết thúc
- **score**: Điểm số
- **isPassed**: Đạt/Không đạt
- **feedback**: Phản hồi

## Cài Đặt và Chạy Dự Án

### Yêu cầu hệ thống

- Node.js (>= 14.x)
- MongoDB (>= 4.x)

### Cài đặt

1. Clone repository
2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ `.env.example` và cấu hình:

```
MONGODB_URI=mongodb://localhost:27017/exam-system
PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
CORS_ORIGIN=*
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
```

### Chạy ứng dụng

```bash
# Chế độ development
npm run start:dev

# Chế độ production
npm run start:prod
```

### Truy cập Swagger UI

Sau khi ứng dụng chạy, truy cập Swagger UI tại:

```
http://localhost:3000/api/docs
```

## Quy Trình Làm Việc

### Quy trình cho Admin

1. Đăng nhập với tài khoản admin
2. Tạo tài khoản cho giáo viên và học sinh
3. Quản lý người dùng (kích hoạt/vô hiệu hóa, đặt lại mật khẩu)
4. Xem thống kê hệ thống

### Quy trình cho Giáo viên

1. Đăng nhập với tài khoản giáo viên
2. Tạo bài thi mới
3. Thêm câu hỏi vào bài thi
4. Xuất bản bài thi
5. Xem và chấm điểm bài nộp

### Quy trình cho Học sinh

1. Đăng nhập với tài khoản học sinh
2. Xem danh sách bài thi đang hoạt động
3. Làm bài thi
4. Nộp bài
5. Xem kết quả và phản hồi

## Tài Liệu API

Tài liệu API đầy đủ có sẵn thông qua Swagger UI tại `/api/docs`. Các API được phân nhóm theo chức năng:

- **auth**: Xác thực và phân quyền
- **users**: Quản lý người dùng
- **admin/users**: Quản lý người dùng (Admin)
- **exams**: Quản lý bài thi
- **questions**: Quản lý câu hỏi
- **submissions**: Quản lý bài nộp
- **notifications**: Quản lý thông báo
- **exam-statistics**: Thống kê bài thi

## Bảo Mật

Hệ thống sử dụng nhiều lớp bảo mật:

- JWT cho xác thực
- Helmet để bảo vệ HTTP headers
- Validation Pipe để xác thực dữ liệu đầu vào
- Guards để kiểm soát quyền truy cập
- Mật khẩu được hash bằng bcrypt

## Mở Rộng

Dự án được thiết kế với kiến trúc module rõ ràng, dễ mở rộng. Để thêm tính năng mới:

1. Tạo module mới hoặc mở rộng module hiện có
2. Cập nhật schema nếu cần
3. Thêm endpoints mới vào controller
4. Cập nhật tài liệu Swagger

## License

[MIT licensed](LICENSE)
