Hướng dẫn sử dụng Swagger trong hệ thống thi trực tuyến

1. Giới thiệu
   Swagger là công cụ mạnh mẽ giúp bạn tài liệu hóa, kiểm thử và tương tác với API của hệ thống thi trực tuyến. Hướng dẫn này sẽ giúp bạn hiểu cách sử dụng Swagger để làm việc với các API của hệ thống.

2. Truy cập Swagger UI
   Để truy cập Swagger UI, hãy làm theo các bước sau:

Đảm bảo ứng dụng đang chạy (sử dụng lệnh npm run start:dev)
Mở trình duyệt web và truy cập địa chỉ:
http://localhost:3000/api/docs 3. Đăng nhập và xác thực
Trước khi có thể sử dụng hầu hết các API, bạn cần đăng nhập và xác thực:

3.1. Đăng nhập
Cuộn xuống phần auth và mở rộng API /api/auth/login
Nhấp vào nút Try it out
Nhập thông tin đăng nhập vào phần Request body:
{
"username": "admin",
"password": "admin123"
}
Nhấp vào nút Execute
Trong phần Response body, bạn sẽ nhận được một JSON chứa access_token. Sao chép giá trị token này (không bao gồm dấu ngoặc kép).
3.2. Xác thực với Swagger
Nhấp vào nút Authorize ở góc trên bên phải màn hình (biểu tượng khóa)
Trong hộp thoại hiện ra, dán token đã sao chép vào ô "Value" (không cần thêm tiền tố "Bearer")
Nhấp vào nút Authorize
Nhấp vào nút Close
Bây giờ bạn đã được xác thực và có thể sử dụng tất cả các API yêu cầu quyền truy cập.

4. Cấu trúc Swagger UI
   Swagger UI được tổ chức thành các phần sau:

Thanh tìm kiếm: Cho phép bạn tìm kiếm API theo tên
Các nhóm API: API được phân loại thành các nhóm như auth, users, exams, questions, submissions, v.v.
Mô tả API: Mỗi API đều có mô tả chi tiết về chức năng, tham số và phản hồi 5. Sử dụng các API chính
5.1. Quản lý người dùng
Xem danh sách người dùng
Mở rộng nhóm users
Mở rộng API GET /api/users
Nhấp vào Try it out
Nhấp vào Execute
Xem danh sách người dùng trong phần Response body
Tạo người dùng mới (chỉ dành cho Admin)
Mở rộng nhóm admin/users
Mở rộng API POST /api/admin/users
Nhấp vào Try it out
Nhập thông tin người dùng mới:
{
"username": "teacher1",
"password": "password123",
"email": "teacher1@example.com",
"fullName": "Giáo viên 1",
"role": "teacher"
}
Nhấp vào Execute
5.2. Quản lý bài thi
Tạo bài thi mới
Mở rộng nhóm exams
Mở rộng API POST /api/exams
Nhấp vào Try it out
Nhập thông tin bài thi:
{
"title": "Bài kiểm tra Toán học",
"description": "Kiểm tra kiến thức cơ bản về đại số",
"duration": 60,
"startDate": "2025-06-10T09:00:00.000Z",
"endDate": "2025-06-10T17:00:00.000Z",
"status": "draft",
"type": "quiz"
}
Nhấp vào Execute
Lưu lại ID của bài thi từ phản hồi để sử dụng cho các bước tiếp theo
Xem danh sách bài thi
Mở rộng API GET /api/exams
Nhấp vào Try it out
Nhấp vào Execute
5.3. Quản lý câu hỏi
Tạo câu hỏi mới
Mở rộng nhóm questions
Mở rộng API POST /api/questions
Nhấp vào Try it out
Nhập thông tin câu hỏi (thay examId bằng ID bài thi đã tạo):
{
"text": "Tổng của 2 + 2 là bao nhiêu?",
"type": "single_choice",
"examId": "your_exam_id_here",
"options": [
{
"text": "3",
"isCorrect": false
},
{
"text": "4",
"isCorrect": true
},
{
"text": "5",
"isCorrect": false
},
{
"text": "6",
"isCorrect": false
}
],
"difficulty": "easy",
"points": 1
}
Nhấp vào Execute
Xem câu hỏi trong bài thi
Mở rộng API GET /api/questions/exam/{examId}
Nhấp vào Try it out
Nhập ID bài thi vào trường examId
Nhấp vào Execute
5.4. Quản lý bài nộp
Tạo bài nộp mới
Mở rộng nhóm submissions
Mở rộng API POST /api/submissions
Nhấp vào Try it out
Nhập thông tin bài nộp (thay các ID bằng giá trị thực tế):
{
"examId": "your_exam_id_here",
"answers": [
{
"questionId": "your_question_id_here",
"selectedOptions": ["your_option_id_here"]
}
]
}
Nhấp vào Execute
Xem bài nộp
Mở rộng API GET /api/submissions/exam/{examId}
Nhấp vào Try it out
Nhập ID bài thi vào trường examId
Nhấp vào Execute 6. Các tính năng hữu ích của Swagger UI
6.1. Xem mẫu dữ liệu (Schema)
Cuộn xuống cuối trang Swagger UI
Mở rộng phần Schemas
Xem cấu trúc dữ liệu của các model trong hệ thống
6.2. Tìm kiếm API
Sử dụng thanh tìm kiếm ở đầu trang
Nhập từ khóa liên quan đến API bạn muốn tìm
6.3. Mở rộng/Thu gọn tất cả
Sử dụng nút Expand Operations để mở rộng tất cả các API
Sử dụng nút Collapse Operations để thu gọn tất cả các API 7. Mẹo và lưu ý
7.1. Xử lý lỗi
Khi gặp lỗi, hãy kiểm tra:

Mã lỗi HTTP (400, 401, 403, 404, 500, v.v.)
Thông báo lỗi trong phần Response body
Đảm bảo bạn đã xác thực đúng cách
7.2. Làm việc với các API yêu cầu quyền Admin
Đảm bảo bạn đăng nhập với tài khoản có quyền Admin
Các API trong nhóm admin/users chỉ có thể được sử dụng bởi Admin
7.3. Làm việc với các API yêu cầu quyền Teacher
Các API tạo bài thi, câu hỏi yêu cầu quyền Teacher hoặc Admin
Giáo viên chỉ có thể quản lý bài thi do họ tạo ra
7.4. Làm việc với các API dành cho Student
Học sinh có thể xem bài thi đang hoạt động và nộp bài
Học sinh không thể tạo hoặc sửa đổi bài thi, câu hỏi 8. Quy trình làm việc điển hình
8.1. Quy trình cho Admin
Đăng nhập với tài khoản Admin
Tạo tài khoản cho giáo viên và học sinh
Quản lý người dùng (kích hoạt/vô hiệu hóa, đặt lại mật khẩu, v.v.)
Xem thống kê hệ thống
8.2. Quy trình cho Teacher
Đăng nhập với tài khoản Teacher
Tạo bài thi mới
Thêm câu hỏi vào bài thi
Xuất bản bài thi
Xem và chấm điểm bài nộp
8.3. Quy trình cho Student
Đăng nhập với tài khoản Student
Xem danh sách bài thi đang hoạt động
Làm bài thi
Nộp bài
Xem kết quả và phản hồi 9. Kết luận
Swagger UI là công cụ mạnh mẽ giúp bạn tương tác với API của hệ thống thi trực tuyến một cách dễ dàng. Bằng cách làm theo hướng dẫn này, bạn có thể sử dụng đầy đủ các tính năng của hệ thống thông qua giao diện trực quan và thân thiện với người dùng.

Nếu bạn gặp bất kỳ vấn đề nào khi sử dụng Swagger UI, hãy kiểm tra lại các bước xác thực và đảm bảo bạn có quyền thích hợp để thực hiện các thao tác mong muốn.
