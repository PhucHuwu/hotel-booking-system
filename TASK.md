BUỔI 1 – XÂY DỰNG NỀN TẢNG & XỬ LÝ NGHIỆP VỤ PHÍA MÁY CHỦ
Mục tiêu

- Thiết lập môi trường phát triển, kho Git, cấu trúc dự án.
- Xây dựng các thành phần phía máy chủ (server‑side logic) cho ít nhất 2 chức năng cốt
  lõi:

* Xác thực & phân quyền (user / admin).
* Nghiệp vụ chính (ví dụ: quản lý sản phẩm, giỏ hàng, đặt hàng).

- Tạo cơ sở dữ liệu và các bảng liên quan.
  Yêu cầu cụ thể
- Chọn 2 chức năng cốt lõi của hệ thống TMĐT (có cả vai trò admin và user).
- Tạo repository trên GitHub/GitLab, thiết lập nhánh develop và quy tắc làm việc nhóm.
- Cài đặt môi trường cho phần xử lý backend (có thể là ngôn ngữ/server-side, BaaS, hoặc
  API framework).
- Thiết kế database (các bảng cần thiết cho 2 chức năng).
- Viết các chức năng server:

* Đăng ký, đăng nhập, phân biệt quyền.
* Với chức năng 1: admin có thể thêm/sửa/xoá một thực thể (sản phẩm, mã giảm
  giá, …).
* Với chức năng 2: user có thể thực hiện hành động mua sắm (thêm vào giỏ, tạo
  đơn hàng, …).

- Kiểm tra thủ công (qua trình duyệt hoặc Postman) để đảm bảo các luồng chính hoạt động.
  Kết quả cần đạt
- Repository có cấu trúc rõ ràng, có file README.md hướng dẫn chạy thử.
- Các chức năng server cơ bản hoàn chỉnh, có thể tương tác để sinh ra dữ liệu.
- Database được tạo và có dữ liệu mẫu (seed).
  Kết quả cần nộp
- Link GitHub repository (chứa toàn bộ mã nguồn backend + cấu hình database).
- File .sql hoặc migration script kèm theo.
- Báo cáo ngắn (1‑2 trang) mô tả các chức năng đã làm được, kèm ảnh chụp màn hình
  kiểm tra (hoặc file log).
extra line for test
