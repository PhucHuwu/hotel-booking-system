
HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
KHOA CÔNG NGHỆ THÔNG TIN 1

MÔN HỌC: PHÂN  TÍCH HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ
BÁO CÁO BÀI TẬP NHÓM
ĐỀ TÀI: XÂY DỰNG HỆ THỐNG ĐẶT PHÒNG KHÁCH SẠN TRỰC TUYẾN




Giảng viên: 
PGS. Đỗ Quang Hưng
Nhóm môn học:
Nhóm bài tập lớn:
N05
1

Số lượng thành viên:

04
Thành viên: 
Bùi Ngọc Vũ - B22DCCN910


Trần Hữu Phúc - B22DCCN634


Lương Tiến Đạt - B22DCCN190


Lương Tuấn Anh - B22DCC021





Hà Nội, 2026
Đánh giá mức độ hoàn thiện của các thành viên
STT
Họ và tên
Mã số
Vai trò
Mức độ hoàn thành
1
Lương Tuấn Anh
B22DDCN021
Trưởng nhóm


2
Lương Tiến Đạt
B22DCCN190
Thành viên


3
Trần Hữu Phúc
B22DCCN634
Thành viên


4
Bùi Ngọc Vũ
B22DCCN910
Thành viên


























Mục Lục
Ký hiệu và chữ viết tắt
CHƯƠNG 1: TÁC NHÂN VÀ BIỂU ĐỒ USECASE TỔNG QUÁT
1.1 Danh sách các tác nhân (Actors) và mô tả chi tiết
Dưới đây là các tác nhân trực tiếp và gián tiếp tương tác với hệ thống:
STT
Tên tác nhân
Mô tả chi tiết
1
Khách hàng (Customer)
Người dùng cuối truy cập website để tìm kiếm phòng, thực hiện đặt phòng (Booking), thanh toán trực tuyến và quản lý lịch sử cá nhân.
2
Nhân viên (Staff/Receptionist)
Người vận hành tại khách sạn: Xác nhận thủ tục Check-in/Check-out, cập nhật trạng thái vệ sinh phòng và xử lý các yêu cầu dịch vụ của khách.
3
Quản trị viên (Admin)
Người quản lý toàn bộ hệ thống, có quyền cao nhất: Quản lý danh mục phòng, thiết lập giá theo thời điểm, quản lý người dùng và xem báo cáo doanh thu.
4
Cổng thanh toán (Payment Gateway)
Hệ thống bên ngoài (ví dụ: VNPay, MoMo) xử lý các giao dịch thanh toán và phản hồi trạng thái giao dịch cho hệ thống.
5
Hệ thống tự động (System Scheduler)
Tác nhân hệ thống tự động quét và xử lý các tác vụ theo thời gian: Hủy đơn quá hạn thanh toán, gửi email nhắc nhở và cập nhật trạng thái phòng.


1.2 Biểu đồ Use Case tổng quát của hệ thống
Các nhóm chức năng (Use Cases) chính:
Nhóm chức năng cho Khách hàng:
Đăng ký/Đăng nhập & Quản lý hồ sơ.
Tìm kiếm và lọc phòng (theo ngày, giá, hạng phòng).
Đặt phòng (Booking).
Thanh toán trực tuyến (Tương tác với Payment Gateway).
Xem lịch sử và Hủy đặt phòng.
Đánh giá và phản hồi dịch vụ.
Nhóm chức năng cho Nhân viên (Staff):
Quản lý sơ đồ phòng thời gian thực (Room Map).
Thực hiện thủ tục Check-in và Check-out.
Cập nhật tình trạng dọn dẹp phòng (Sạch/Bẩn).
Ghi nhận dịch vụ phát sinh (Minibar, giặt ủi...).
Nhóm chức năng cho Quản trị viên (Admin):
Quản lý thông tin và số lượng phòng (Inventory).
Cấu hình giá phòng linh hoạt (theo mùa, ngày lễ).
Quản lý và phân quyền tài khoản nhân viên.
Thống kê báo cáo doanh thu và hiệu suất phòng.
Nhóm chức năng Hệ thống (System):
Gửi thông báo xác nhận tự động (Email/SMS).
Tự động giải phóng phòng khi hết hạn thanh toán.

CHƯƠNG 2: MÔ TẢ VÀ ĐẶC TẢ USECASE CHI TIẾT 
2.1 Bảng danh mục Usecase
Tác nhân
Tên Usecase
Mô tả ngắn gọn
Khách hàng
Đăng ký/Đăng nhập & Quản lý hồ sơ
Cho phép người dùng tạo tài khoản, đăng nhập và cập nhật thông tin cá nhân.


Tìm kiếm và lọc phòng
Tìm kiếm phòng theo ngày, giá, hạng phòng và các tiện nghi.


Đặt phòng (Booking)
Thực hiện đặt phòng trực tuyến sau khi chọn phòng và ngày.


Thanh toán trực tuyến
Thanh toán qua cổng thanh toán (VNPay, MoMo...) và nhận xác nhận.


Xem lịch sử và Hủy đặt phòng
Xem lịch sử đặt phòng và hủy đơn trong điều kiện cho phép.


Đánh giá và phản hồi dịch vụ
Gửi đánh giá, sao và phản hồi sau khi sử dụng dịch vụ.
Nhân viên
Quản lý sơ đồ phòng thời gian thực (Room Map)
Xem và cập nhật sơ đồ phòng theo trạng thái thực tế.


Thực hiện Check-in và Check-out
Thực hiện thủ tục nhận phòng và trả phòng cho khách.


Cập nhật tình trạng dọn dẹp phòng
Đánh dấu phòng Sạch/Bẩn sau khi dọn.


Ghi nhận dịch vụ phát sinh
Ghi nhận dịch vụ thêm (Minibar, giặt ủi...) cho từng phòng.
Quản trị viên
Quản lý thông tin và số lượng phòng (Inventory)
Thêm/sửa/xóa loại phòng, số phòng và thông tin.


Cấu hình giá phòng linh hoạt
Thiết lập giá theo mùa, ngày lễ, sự kiện.


Quản lý và phân quyền tài khoản nhân viên
Tạo/sửa/khóa tài khoản và phân quyền nhân viên.


Thống kê báo cáo doanh thu và hiệu suất phòng
Xem báo cáo doanh thu, tỷ lệ lấp phòng theo kỳ.
Hệ thống
Gửi thông báo xác nhận tự động (Email/SMS)
Gửi email/SMS xác nhận đặt phòng, nhắc thanh toán, nhắc nhở.


Tự động giải phóng phòng khi hết hạn thanh toán
Hủy đơn và trả lại phòng khi quá hạn thanh toán.

2.2. Đặc tả Usecase chi tiết 
UC01: Đăng ký/Đăng nhập & Quản lý hồ sơ
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép người dùng mới đăng ký tài khoản, đăng nhập và cập nhật thông tin cá nhân (họ tên, SĐT, email, mật khẩu).
Điều kiện tiên quyết
Đăng ký: Chưa có tài khoản. Đăng nhập: Đã có tài khoản. Quản lý hồ sơ: Đã đăng nhập.
Điều kiện kết thúc
Thành công: Tạo phiên đăng nhập hoặc cập nhật thông tin. Thất bại: Hiển thị lỗi (email trùng, mật khẩu sai...).
Luồng sự kiện chính
1. Khách chọn Đăng ký/Đăng nhập hoặc vào mục Hồ sơ. 2. Nhập thông tin. 3. Hệ thống kiểm tra và lưu hoặc xác thực. 4. Hệ thống tạo phiên và chuyển vào trang chủ hoặc hiển thị form hồ sơ. 5. Nếu quản lý hồ sơ: sửa thông tin và xác nhận.
Luồng sự kiện phụ
A1: Email đã tồn tại khi đăng ký → Thông báo. A2: Sai mật khẩu khi đăng nhập → Thông báo, cho thử lại hoặc quên mật khẩu.

UC02: Tìm kiếm và lọc phòng
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách nhập ngày đến/đi, số khách, hạng phòng, khoảng giá và tiện nghi để xem danh sách phòng còn trống.
Điều kiện tiên quyết
Hệ thống có ít nhất một loại phòng và giá được cấu hình.
Điều kiện kết thúc
Thành công: Hiển thị danh sách phòng thỏa điều kiện. Thất bại: Thông báo và gợi ý đổi ngày/tiêu chí.
Luồng sự kiện chính
1. Khách nhập ngày nhận phòng, ngày trả phòng, số khách. 2. Khách nhấn Tìm kiếm. 3. Hệ thống kiểm tra tồn phòng trống và áp dụng bộ lọc. 4. Hệ thống hiển thị danh sách phòng kèm giá. 5. Khách xem chi tiết và chọn để đặt.
Luồng sự kiện phụ
A1: Khoảng ngày không hợp lệ → Thông báo nhập lại. A2: Không có phòng trống → Thông báo và gợi ý thay đổi tiêu chí.

UC03: Đặt phòng (Booking)
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách đã chọn phòng và ngày thực hiện đặt phòng: nhập thông tin liên hệ, xác nhận điều khoản và tạo đơn (trạng thái chờ thanh toán).
Điều kiện tiên quyết
Khách đã tìm kiếm và chọn được phòng còn trống; phòng vẫn còn trống tại thời điểm đặt.
Điều kiện kết thúc
Thành công: Hệ thống tạo đơn và chuyển sang thanh toán. Thất bại: Thông báo lỗi, không tạo đơn.
Luồng sự kiện chính
1. Khách chọn phòng và nhấn Đặt phòng. 2. Hệ thống hiển thị form thông tin khách, ngày, tổng tiền, điều khoản. 3. Khách điền và xác nhận. 4. Hệ thống kiểm tra phòng còn trống và tạo đơn. 5. Hệ thống hiển thị mã đơn và chuyển đến trang thanh toán.
Luồng sự kiện phụ
A1: Khách hủy → Không tạo đơn. A2: Phòng vừa được đặt bởi người khác → Thông báo, đề nghị chọn phòng/ngày khác.

UC04: Thanh toán trực tuyến
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng (tương tác với Cổng thanh toán)
Mô tả
Cho phép khách thanh toán đơn qua cổng (VNPay, MoMo...); hệ thống nhận kết quả và cập nhật trạng thái đơn.
Điều kiện tiên quyết
Khách có đơn ở trạng thái Chờ thanh toán; đơn chưa quá hạn.
Điều kiện kết thúc
Thành công: Cập nhật đơn Đã thanh toán, gửi email xác nhận. Thất bại: Đơn vẫn Chờ thanh toán hoặc bị hủy khi hết hạn.
Luồng sự kiện chính
1. Khách chọn phương thức và xác nhận. 2. Hệ thống chuyển sang cổng thanh toán. 3. Khách thanh toán trên cổng. 4. Cổng callback về hệ thống. 5. Hệ thống xác thực và cập nhật đơn. 6. Gửi email xác nhận và hiển thị trang kết quả.
Luồng sự kiện phụ
A1: Khách đóng trang cổng → Đơn giữ Chờ thanh toán. A2: Thanh toán thất bại → Thông báo, thử lại hoặc chọn phương thức khác.

UC05: Xem lịch sử và Hủy đặt phòng
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách xem danh sách đơn (đã thanh toán, chờ thanh toán, đã hủy) và hủy đơn trong chính sách cho phép.
Điều kiện tiên quyết
Khách đã đăng nhập.
Điều kiện kết thúc
Thành công: Hiển thị lịch sử; nếu hủy thì cập nhật Đã hủy và có thể hoàn tiền. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Khách vào Lịch sử đặt phòng. 2. Hệ thống hiển thị danh sách đơn. 3. Khách chọn đơn xem chi tiết. 4. Nếu được phép hủy: nhấn Hủy đơn và xác nhận. 5. Hệ thống cập nhật Đã hủy, giải phóng phòng và thông báo.
Luồng sự kiện phụ
A1: Đơn quá thời hạn hủy → Nút Hủy ẩn/vô hiệu. A2: Đơn chưa thanh toán quá hạn → Hệ thống tự động hủy.

UC06: Đánh giá và phản hồi dịch vụ
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách sau khi trả phòng gửi đánh giá (sao) và nhận xét về phòng/dịch vụ.
Điều kiện tiên quyết
Khách đã đăng nhập; có ít nhất một đơn đã hoàn thành (Check-out).
Điều kiện kết thúc
Thành công: Lưu đánh giá và hiển thị. Thất bại: Thông báo (đã đánh giá rồi, đơn không hợp lệ).
Luồng sự kiện chính
1. Khách vào Lịch sử, chọn đơn đã Check-out chưa đánh giá. 2. Nhấn Đánh giá. 3. Hệ thống hiển thị form: số sao, nhận xét. 4. Khách gửi đánh giá. 5. Hệ thống lưu và thông báo cảm ơn.
Luồng sự kiện phụ
A1: Đã đánh giá rồi → Ẩn nút hoặc thông báo. A2: Nội dung vi phạm → Từ chối hoặc chuyển duyệt.

UC07: Quản lý sơ đồ phòng thời gian thực (Room Map)
Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên xem sơ đồ phòng theo tầng với trạng thái (Trống, Đã đặt, Đang ở, Bảo trì, Bẩn) và cập nhật trạng thái.
Điều kiện tiên quyết
Nhân viên đã đăng nhập với quyền xem/sửa sơ đồ phòng.
Điều kiện kết thúc
Thành công: Hiển thị sơ đồ đúng; cập nhật được lưu. Thất bại: Thông báo lỗi quyền hoặc lưu.
Luồng sự kiện chính
1. Nhân viên vào Room Map. 2. Hệ thống hiển thị sơ đồ với màu/icon theo trạng thái. 3. Lọc theo tầng, trạng thái. 4. Chọn phòng xem chi tiết hoặc cập nhật trạng thái (Bẩn → Đang dọn → Sạch). 5. Hệ thống lưu và cập nhật hiển thị.
Luồng sự kiện phụ
A1: Mất kết nối → Thông báo, thử lại.

UC08: Thực hiện Check-in và Check-out
Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên thực hiện thủ tục nhận phòng (Check-in) và trả phòng (Check-out): xác nhận đơn, cập nhật trạng thái phòng và đơn.
Điều kiện tiên quyết
Nhân viên đã đăng nhập; có đơn đã thanh toán (Check-in) hoặc khách đang ở (Check-out).
Điều kiện kết thúc
Thành công: Check-in → Phòng Đang ở, đơn Đang lưu trú. Check-out → Phòng Bẩn, đơn Hoàn thành. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên tìm khách theo mã đơn hoặc tên/SĐT. 2. Hệ thống hiển thị thông tin đơn. 3. Check-in: xác nhận và nhấn Check-in → cập nhật trạng thái. 4. Check-out: xác nhận và nhấn Check-out → cập nhật phòng (Bẩn), đơn (Hoàn thành), in hóa đơn hoặc gửi email.
Luồng sự kiện phụ
A1: Trả phòng trễ → Tính phí trả trễ (nếu có). A2: Đơn chưa thanh toán mà Check-in → Cảnh báo hoặc chặn.

UC09: Cập nhật tình trạng dọn dẹp phòng
Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên đánh dấu tình trạng phòng: Bẩn, Đang dọn, Sạch (sẵn sàng cho khách mới).
Điều kiện tiên quyết
Nhân viên đã đăng nhập; phòng tồn tại và không đang ở khách.
Điều kiện kết thúc
Thành công: Trạng thái phòng cập nhật và hiển thị trên Room Map. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên mở Room Map hoặc danh sách phòng, chọn phòng. 2. Chọn trạng thái: Bẩn / Đang dọn / Sạch. 3. Hệ thống lưu và cập nhật ngay trên sơ đồ.
Luồng sự kiện phụ
Không có.

UC10: Ghi nhận dịch vụ phát sinh
Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên ghi nhận dịch vụ phát sinh (Minibar, giặt ủi, ăn uống tại phòng...) cho từng phòng/đơn để tính thêm vào hóa đơn.
Điều kiện tiên quyết
Nhân viên đã đăng nhập; có đơn đang lưu trú.
Điều kiện kết thúc
Thành công: Dịch vụ ghi nhận và cộng vào đơn; Check-out hiển thị trong hóa đơn. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên chọn đơn đang lưu trú (hoặc phòng đang ở). 2. Thêm dịch vụ: chọn loại, số lượng, ghi chú. 3. Hệ thống tính tiền và thêm vào đơn. 4. Check-out: tổng đơn = phòng + dịch vụ phát sinh.
Luồng sự kiện phụ
A1: Sửa/xóa dịch vụ vừa ghi nhận sai → Cho phép sửa trước khi khóa đơn.

UC11: Quản lý thông tin và số lượng phòng (Inventory)
Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin thêm/sửa/xóa loại phòng, số lượng phòng, thông tin (diện tích, giường, tiện nghi, ảnh, mô tả).
Điều kiện tiên quyết
Admin đã đăng nhập. Không có đơn đang hoạt động gắn phòng khi xóa/thu hẹp.
Điều kiện kết thúc
Thành công: Danh mục phòng cập nhật; khách tìm kiếm và đặt theo thông tin mới. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Admin vào Quản lý phòng. 2. Xem danh sách loại phòng và từng phòng. 3. Thêm loại phòng: tên, diện tích, tiện nghi, ảnh, số lượng. 4. Sửa: chọn loại/phòng → chỉnh thông tin → lưu. 5. Xóa: chọn (khi không còn đơn liên quan) → xác nhận.
Luồng sự kiện phụ
A1: Xóa loại phòng đang có đơn đặt tương lai → Cảnh báo, hủy đơn hoặc chuyển phòng trước.

UC12: Cấu hình giá phòng linh hoạt
Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin thiết lập giá theo ngày, mùa, ngày lễ hoặc sự kiện để hệ thống tính giá khi khách tìm kiếm và đặt phòng.
Điều kiện tiên quyết
Admin đã đăng nhập; đã có ít nhất một loại phòng.
Điều kiện kết thúc
Thành công: Giá áp dụng; tìm kiếm và đặt phòng hiển thị đúng giá. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Admin vào Cấu hình giá. 2. Chọn loại phòng và khoảng ngày (hoặc mùa/ngày lễ). 3. Nhập giá (theo đêm hoặc đơn vị). 4. Hệ thống lưu; trùng ngày thì ưu tiên (ngày lễ > mùa > mặc định).
Luồng sự kiện phụ
A1: Hai bảng giá trùng ngày → Cảnh báo và đề nghị chỉnh lại.

UC13: Quản lý và phân quyền tài khoản nhân viên
Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin tạo/sửa/khóa tài khoản nhân viên và phân quyền (Receptionist, Housekeeping...).
Điều kiện tiên quyết
Admin đã đăng nhập.
Điều kiện kết thúc
Thành công: Tài khoản được tạo/sửa/khóa; đăng nhập và quyền đúng vai trò. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Admin vào Quản lý nhân viên. 2. Xem danh sách (email, tên, vai trò, trạng thái). 3. Tạo mới: email, tên, mật khẩu tạm, vai trò → gửi mail kích hoạt. 4. Sửa: đổi tên, vai trò, đặt lại mật khẩu. 5. Khóa/Mở khóa: chọn tài khoản → xác nhận.
Luồng sự kiện phụ
A1: Khóa tài khoản đang đăng nhập → Phiên có thể bị đăng xuất ở request tiếp theo.


UC14: Thống kê báo cáo doanh thu và hiệu suất phòng
Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin xem báo cáo doanh thu theo ngày/tuần/tháng/năm và tỷ lệ lấp phòng (occupancy), xuất file.
Điều kiện tiên quyết
Admin đã đăng nhập.
Điều kiện kết thúc
Thành công: Hiển thị bảng/biểu đồ và cho phép xuất (Excel/PDF). Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Admin vào Báo cáo/Thống kê. 2. Chọn kỳ và loại báo cáo (doanh thu, occupancy, theo loại phòng). 3. Hệ thống truy vấn và hiển thị bảng/biểu đồ. 4. Admin có thể xuất file.
Luồng sự kiện phụ
Không có.

UC15: Gửi thông báo xác nhận tự động (Email/SMS)
Mục
Nội dung chi tiết
Tác nhân chính
Hệ thống (System Scheduler)
Mô tả
Hệ thống tự động gửi email/SMS khi có sự kiện: xác nhận đặt phòng, nhắc thanh toán, xác nhận thanh toán, nhắc Check-in/Check-out.
Điều kiện tiên quyết
Đã cấu hình dịch vụ email/SMS; có sự kiện kích hoạt.
Điều kiện kết thúc
Thành công: Khách/nhân viên nhận thông báo đúng nội dung. Thất bại: Ghi log, retry theo cấu hình.
Luồng sự kiện chính
1. Sự kiện xảy ra (đặt phòng, thanh toán, đến thời điểm nhắc). 2. Hệ thống lấy template và dữ liệu. 3. Gọi API email/SMS và gửi. 4. Cập nhật trạng thái đã gửi (tránh gửi trùng).
Luồng sự kiện phụ
A1: Gửi thất bại → Ghi log, retry theo chính sách.

UC16: Tự động giải phóng phòng khi hết hạn thanh toán
Mục
Nội dung chi tiết
Tác nhân chính
Hệ thống (System Scheduler)
Mô tả
Định kỳ quét các đơn Chờ thanh toán đã quá thời hạn; tự động chuyển đơn sang Đã hủy và giải phóng phòng.
Điều kiện tiên quyết
Có job chạy theo lịch; đơn có trạng thái Chờ thanh toán và thời hạn thanh toán < hiện tại.
Điều kiện kết thúc
Thành công: Đơn Đã hủy, phòng có thể đặt lại; có thể gửi email thông báo hủy. Thất bại: Ghi log, retry.
Luồng sự kiện chính
1. Scheduler chạy theo lịch. 2. Truy vấn đơn: trạng thái = Chờ thanh toán AND thời hạn < now. 3. Với mỗi đơn: cập nhật Đã hủy, cập nhật trạng thái phòng. 4. (Tùy chọn) Gửi email thông báo hủy cho khách.
Luồng sự kiện phụ
A1: Đơn đang trong quá trình thanh toán (callback chưa về) → Dùng trạng thái "Đang thanh toán" và chỉ hủy khi quá hạn vẫn Chờ thanh toán.


CHƯƠNG 3: BIỂU ĐỒ TUẦN TỰ CHI TIẾT
3.1. Nguyên tắc xây dựng biểu đồ tuần tự 
3.1.1 UC01: Đăng ký/Đăng nhập & Quản lý hồ sơ
Đối tượng
- Khách hàng (Actor)
- RegistrationLoginForm (Boundary)
- AuthController (Control)
- User (Entity)
Luồng cơ bản (Đăng ký)
1. Khách hàng nhấn "Đăng ký" → RegistrationLoginForm
2. RegistrationLoginForm hiển thị form đăng ký (họ tên, email, SĐT, mật khẩu) → Khách hàng
3. Khách hàng nhập thông tin và nhấn "Xác nhận" → RegistrationLoginForm
4. RegistrationLoginForm gửi yêu cầu register(userInfo) → AuthController
5. AuthController gọi checkExistingEmail(email) → User
6. User trả về kết quả kiểm tra → AuthController
7. Email chưa tồn tại:
   - AuthController gọi createUser(userInfo) → User
   - User lưu thông tin và trả về kết quả thành công → AuthController
   - AuthController tạo phiên đăng nhập và trả về thành công → RegistrationLoginForm
   - RegistrationLoginForm chuyển đến trang chủ → Khách hàng
8. Email đã tồn tại:
   - AuthController trả về lỗi "Email đã tồn tại" → RegistrationLoginForm
   - RegistrationLoginForm hiển thị thông báo lỗi → Khách hàng

Luồng cơ bản (Đăng nhập)
1. Khách hàng nhấn "Đăng nhập" → RegistrationLoginForm
2. RegistrationLoginForm hiển thị form đăng nhập (email, mật khẩu) → Khách hàng
3. Khách hàng nhập email, mật khẩu và nhấn "Đăng nhập" → RegistrationLoginForm
4. RegistrationLoginForm gửi yêu cầu login(email, password) → AuthController
5. AuthController gọi validateCredentials(email, password) → User
6. User trả về kết quả xác thực → AuthController
7. Xác thực thành công:
   - AuthController tạo phiên và trả về thành công → RegistrationLoginForm
   - RegistrationLoginForm chuyển đến trang chủ → Khách hàng
8. Sai mật khẩu:
   - AuthController trả về lỗi "Sai mật khẩu" → RegistrationLoginForm
   - RegistrationLoginForm hiển thị thông báo, cho thử lại hoặc quên mật khẩu → Khách hàng
Luồng cơ bản (Quản lý hồ sơ)
1. Khách hàng nhấn "Hồ sơ cá nhân" → RegistrationLoginForm
2. RegistrationLoginForm gửi yêu cầu getProfile(userId) → AuthController
3. AuthController gọi getUserById(userId) → User
4. User trả về thông tin cá nhân → AuthController
5. AuthController trả về dữ liệu hồ sơ → RegistrationLoginForm
6. RegistrationLoginForm hiển thị form hồ sơ → Khách hàng
7. Khách hàng sửa thông tin và nhấn "Cập nhật" → RegistrationLoginForm
8. RegistrationLoginForm gửi yêu cầu updateProfile(userId, newInfo) → AuthController
9. AuthController gọi updateUser(userId, newInfo) → User
10. User cập nhật và trả về kết quả → AuthController
11. AuthController trả về thành công → RegistrationLoginForm
12. RegistrationLoginForm hiển thị thông báo cập nhật thành công → Khách hàng

3.1.2 : UC02: Tìm kiếm và lọc phòng
Đối tượng
- Khách hàng (Actor)
- SearchForm (Boundary)
- SearchController (Control)
- Room (Entity)
- RoomPrice (Entity)

Luồng cơ bản
1. Khách hàng nhập ngày nhận phòng, ngày trả phòng, số khách (và tùy chọn: hạng phòng, giá, tiện nghi) → SearchForm
2. Khách hàng nhấn "Tìm kiếm" → SearchForm
3. SearchForm gửi yêu cầu searchRooms(checkIn, checkOut, guests, filters) → SearchController
4. SearchController gọi validateDates(checkIn, checkOut) → SearchController (self-call)
5. Ngày hợp lệ:
   - SearchController gọi findAvailableRooms(checkIn, checkOut, guests, filters) → Room
   - Room trả về danh sách phòng trống → SearchController
   - SearchController gọi getPriceForDates(roomIds, checkIn, checkOut) → RoomPrice
   - RoomPrice trả về giá tương ứng → SearchController
   - Có phòng trống:
     - SearchController trả về danh sách phòng kèm giá → SearchForm
     - SearchForm hiển thị danh sách phòng với giá và hình ảnh → Khách hàng
   - Không có phòng trống:
     - SearchController trả về thông báo "Không có phòng trống" → SearchForm
     - SearchForm hiển thị thông báo và gợi ý thay đổi tiêu chí → Khách hàng
6. Ngày không hợp lệ:
   - SearchController trả về lỗi "Khoảng ngày không hợp lệ" → SearchForm
   - SearchForm hiển thị thông báo nhập lại → Khách hàng

3.1.3 : UC03 : Đặt phòng (Booking)
Đối tượng
- Khách hàng (Actor)
- BookingForm (Boundary)
- BookingController (Control)
- Room (Entity)
- Booking (Entity)

Luồng cơ bản
1. Khách hàng chọn phòng và nhấn "Đặt phòng" → BookingForm
2. BookingForm gửi yêu cầu initBooking(roomId, checkIn, checkOut) → BookingController
3. BookingController gọi checkAvailability(roomId, checkIn, checkOut) → Room
4. Room trả về trạng thái phòng → BookingController
5. Phòng còn trống:
   - BookingController trả về thông tin form (thông tin khách, ngày, tổng tiền, điều khoản) → BookingForm
   - BookingForm hiển thị form đặt phòng → Khách hàng
   - Khách hàng điền thông tin và nhấn "Xác nhận" → BookingForm
   - BookingForm gửi yêu cầu createBooking(bookingInfo) → BookingController
   - BookingController gọi lockRoom(roomId, checkIn, checkOut) → Room
   - Room khóa phòng và trả về kết quả → BookingController
   - BookingController gọi saveBooking(bookingInfo) → Booking
   - Booking lưu đơn (trạng thái: Chờ thanh toán) và trả về mã đơn → BookingController
   - BookingController trả về mã đơn → BookingForm
   - BookingForm hiển thị mã đơn và chuyển đến trang thanh toán → Khách hàng
6. Phòng đã được đặt:
   - BookingController trả về lỗi "Phòng không còn trống" → BookingForm
   - BookingForm thông báo và đề nghị chọn phòng/ngày khác → Khách hàng

Luồng phụ
- Khách hàng nhấn "Hủy" trước khi xác nhận:
- BookingForm hủy quy trình, không tạo đơn → Khách hàng
3.1.4 : UC04 : Thanh toán trực tuyến
Đối tượng
- Khách hàng (Actor)
- PaymentForm (Boundary)
- PaymentController (Control)
- Booking (Entity)
- PaymentGateway (Actor - hệ thống bên ngoài)

Luồng cơ bản
1. Khách hàng chọn phương thức thanh toán (VNPay, MoMo...) và nhấn "Thanh toán" → PaymentForm
2. PaymentForm gửi yêu cầu initiatePayment(bookingId, method) → PaymentController
3. PaymentController gọi getBooking(bookingId) → Booking
4. Booking trả về thông tin đơn (trạng thái: Chờ thanh toán) → PaymentController
5. PaymentController tạo yêu cầu thanh toán createTransaction(amount, method) → PaymentGateway
6. PaymentGateway trả về URL thanh toán → PaymentController
7. PaymentController trả về URL → PaymentForm
8. PaymentForm chuyển hướng khách đến trang cổng thanh toán → Khách hàng
9. Khách hàng thực hiện thanh toán trên cổng → PaymentGateway
10. PaymentGateway gửi callback kết quả paymentCallback(transactionId, status) → PaymentController
11.  Thanh toán thành công:
    - PaymentController gọi updateStatus(bookingId, "Đã thanh toán") → Booking
    - Booking cập nhật trạng thái và trả về kết quả → PaymentController
    - PaymentController gửi email xác nhận → Khách hàng (qua hệ thống email)
    - PaymentController trả về kết quả thành công → PaymentForm
    - PaymentForm hiển thị trang xác nhận thanh toán thành công → Khách hàng
12.  Thanh toán thất bại:
    - PaymentController trả về lỗi → PaymentForm
    - PaymentForm thông báo, cho thử lại hoặc chọn phương thức khác → Khách hàng

Luồng phụ
  -  Khách đóng trang cổng thanh toán mà không hoàn tất:
  - Đơn giữ trạng thái Chờ thanh toán
  -  Callback không hợp lệ:
  - PaymentController ghi log lỗi
3.1.5 : UC05 : Xem lịch sử và Hủy đặt phòng
Đối tượng
- Khách hàng (Actor)
- BookingHistoryPage (Boundary)
- BookingController (Control)
- Booking (Entity)
- Room (Entity)
Luồng cơ bản

1. Khách hàng nhấn "Lịch sử đặt phòng" → BookingHistoryPage
2. BookingHistoryPage gửi yêu cầu getBookingHistory(userId) → BookingController
3. BookingController gọi findByUserId(userId) → Booking
4. Booking trả về danh sách đơn (đã thanh toán, chờ thanh toán, đã hủy) → BookingController
5. BookingController trả về danh sách → BookingHistoryPage
6. BookingHistoryPage hiển thị danh sách đơn → Khách hàng
7. Khách hàng chọn đơn xem chi tiết → BookingHistoryPage
8. BookingHistoryPage hiển thị chi tiết đơn → Khách hàng
9.  Khách hàng muốn hủy đơn (nút Hủy hiển thị nếu trong thời hạn):
   - Khách hàng nhấn "Hủy đơn" và xác nhận → BookingHistoryPage
   - BookingHistoryPage gửi yêu cầu cancelBooking(bookingId) → BookingController
   - BookingController gọi updateStatus(bookingId, "Đã hủy") → Booking
   - Booking cập nhật trạng thái → BookingController
   - BookingController gọi releaseRoom(roomId, checkIn, checkOut) → Room
   - Room giải phóng phòng → BookingController
   - BookingController trả về kết quả hủy thành công → BookingHistoryPage
   - BookingHistoryPage hiển thị thông báo hủy thành công → Khách hàng

Luồng phụ
 -  Đơn quá thời hạn hủy:
 - Nút "Hủy" ẩn hoặc vô hiệu hóa, khách không thể hủy
 -  Đơn chưa thanh toán quá hạn:
 - Hệ thống tự động chuyển trạng thái Đã hủy (xử lý bởi UC16)
3.1.6 : UC06 Đánh giá và phản hồi dịch vụ

Đối tượng
- Khách hàng (Actor)
- ReviewForm (Boundary)
- ReviewController (Control)
- Review (Entity)
- Booking (Entity)

Luồng cơ bản

1. Khách hàng vào Lịch sử đặt phòng, chọn đơn đã Check-out chưa đánh giá → ReviewForm
2. Khách hàng nhấn "Đánh giá" → ReviewForm
3. ReviewForm gửi yêu cầu checkReviewEligibility(bookingId) → ReviewController
4. ReviewController gọi getBooking(bookingId) → Booking
5. Booking trả về thông tin đơn (trạng thái: Hoàn thành) → ReviewController
6. ReviewController gọi hasExistingReview(bookingId) → Review
7. Review trả về kết quả kiểm tra → ReviewController
8.  Chưa đánh giá:
   - ReviewController trả về cho phép đánh giá → ReviewForm
   - ReviewForm hiển thị form: số sao, nhận xét → Khách hàng
   - Khách hàng nhập đánh giá và nhấn "Gửi" → ReviewForm
   - ReviewForm gửi yêu cầu submitReview(bookingId, rating, comment) → ReviewController
   - ReviewController gọi saveReview(bookingId, rating, comment) → Review
   - Review lưu đánh giá → ReviewController
   - ReviewController trả về thành công → ReviewForm
   - ReviewForm hiển thị thông báo "Cảm ơn bạn đã đánh giá" → Khách hàng
9.  Đã đánh giá rồi:
   - ReviewController trả về lỗi → ReviewForm
   - ReviewForm ẩn nút hoặc thông báo "Bạn đã đánh giá đơn này" → Khách hàng

Luồng phụ

-  Nội dung vi phạm:
- ReviewController kiểm tra nội dung → Từ chối hoặc chuyển duyệt
3.1.7 : UC07: Quản lý sơ đồ phòng thời gian thực (Room Map)

Đối tượng
- Nhân viên (Actor)
- RoomMapPage (Boundary)
- RoomMapController (Control)
- Room (Entity)

Luồng cơ bản
1. Nhân viên nhấn "Room Map" → RoomMapPage
2. RoomMapPage gửi yêu cầu getRoomMap() → RoomMapController
3. RoomMapController gọi getAllRoomsWithStatus() → Room
4. Room trả về danh sách phòng với trạng thái (Trống, Đã đặt, Đang ở, Bảo trì, Bẩn) → RoomMapController
5. RoomMapController trả về dữ liệu sơ đồ → RoomMapPage
6. RoomMapPage hiển thị sơ đồ phòng với màu/icon theo trạng thái → Nhân viên
7.  Nhân viên lọc theo tầng, trạng thái:
   - Nhân viên chọn bộ lọc → RoomMapPage
   - RoomMapPage gửi filterRooms(floor, status) → RoomMapController
   - RoomMapController gọi findByFilter(floor, status) → Room
   - Room trả về danh sách lọc → RoomMapController
   - RoomMapController trả về kết quả → RoomMapPage
   - RoomMapPage cập nhật hiển thị → Nhân viên
8.  Nhân viên cập nhật trạng thái phòng:
   - Nhân viên chọn phòng → RoomMapPage
   - Nhân viên chọn trạng thái mới (ví dụ: Bẩn → Đang dọn → Sạch) → RoomMapPage
   - RoomMapPage gửi updateRoomStatus(roomId, newStatus) → RoomMapController
   - RoomMapController gọi setStatus(roomId, newStatus) → Room
   - Room cập nhật và trả về kết quả → RoomMapController
   - RoomMapController trả về thành công → RoomMapPage
   - RoomMapPage cập nhật hiển thị trên sơ đồ → Nhân viên

 Luồng phụ
  - Mất kết nối:
  - RoomMapPage hiển thị thông báo lỗi, cho thử lại → Nhân viên
3.1.8 : Thực hiện Check-in và Check-out
Đối tượng

- Nhân viên (Actor)
- CheckInOutForm (Boundary)
- CheckInOutController (Control)
- Booking (Entity)
- Room (Entity)

Luồng cơ bản (Check-in)

1. Nhân viên nhập mã đơn hoặc tên/SĐT khách và nhấn "Tìm kiếm" → CheckInOutForm
2. CheckInOutForm gửi yêu cầu findBooking(keyword) → CheckInOutController
3. CheckInOutController gọi searchBooking(keyword) → Booking
4. Booking trả về thông tin đơn (trạng thái: Đã thanh toán) → CheckInOutController
5. CheckInOutController trả về thông tin đơn → CheckInOutForm
6. CheckInOutForm hiển thị thông tin đơn → Nhân viên
7. Nhân viên xác nhận và nhấn "Check-in" → CheckInOutForm
8. CheckInOutForm gửi yêu cầu checkIn(bookingId) → CheckInOutController
9. CheckInOutController gọi updateStatus(bookingId, "Đang lưu trú") → Booking
10. Booking cập nhật trạng thái → CheckInOutController
11. CheckInOutController gọi setStatus(roomId, "Đang ở") → Room
12. Room cập nhật trạng thái → CheckInOutController
13. CheckInOutController trả về thành công → CheckInOutForm
14. CheckInOutForm hiển thị thông báo Check-in thành công → Nhân viên

 Luồng cơ bản (Check-out)
1. Nhân viên tìm khách theo mã đơn hoặc tên/SĐT → CheckInOutForm
2. CheckInOutForm gửi yêu cầu findBooking(keyword) → CheckInOutController
3. CheckInOutController gọi searchBooking(keyword) → Booking
4. Booking trả về thông tin đơn (trạng thái: Đang lưu trú) → CheckInOutController
5. CheckInOutController trả về thông tin đơn → CheckInOutForm
6. CheckInOutForm hiển thị thông tin đơn → Nhân viên
7. Nhân viên xác nhận và nhấn "Check-out" → CheckInOutForm
8. CheckInOutForm gửi yêu cầu checkOut(bookingId) → CheckInOutController
9. CheckInOutController gọi updateStatus(bookingId, "Hoàn thành") → Booking
10. Booking cập nhật trạng thái → CheckInOutController
11. CheckInOutController gọi setStatus(roomId, "Bẩn") → Room
12. Room cập nhật trạng thái → CheckInOutController
13. CheckInOutController tạo hóa đơn hoặc gửi email tổng kết → CheckInOutController
14. CheckInOutController trả về thành công → CheckInOutForm
15. CheckInOutForm hiển thị thông báo Check-out thành công, in hóa đơn → Nhân viên

Luồng phụ

-  Trả phòng trễ:
  - CheckInOutController tính phí trả trễ → cộng vào hóa đơn
-  Đơn chưa thanh toán mà Check-in:
  - CheckInOutController trả về cảnh báo → CheckInOutForm
  - CheckInOutForm hiển thị cảnh báo hoặc chặn Check-in → Nhân viên

3.1.9 :  UC09: Cập nhật tình trạng dọn dẹp phòng
Đối tượng
- Nhân viên (Actor)
- HousekeepingPage (Boundary)
- HousekeepingController (Control)
- Room (Entity)

Luồng cơ bản

1. Nhân viên mở Room Map hoặc Danh sách phòng → HousekeepingPage
2. HousekeepingPage gửi yêu cầu getRoomList() → HousekeepingController
3. HousekeepingController gọi getAllRooms() → Room
4. Room trả về danh sách phòng với trạng thái dọn dẹp → HousekeepingController
5. HousekeepingController trả về danh sách → HousekeepingPage
6. HousekeepingPage hiển thị danh sách phòng → Nhân viên
7. Nhân viên chọn phòng cần cập nhật → HousekeepingPage
8. Nhân viên chọn trạng thái: Bẩn / Đang dọn / Sạch → HousekeepingPage
9. HousekeepingPage gửi yêu cầu updateCleaningStatus(roomId, status) → HousekeepingController
10. HousekeepingController gọi setCleaningStatus(roomId, status) → Room
11. Room cập nhật trạng thái và trả về kết quả → HousekeepingController
12. HousekeepingController trả về thành công → HousekeepingPage
13. HousekeepingPage cập nhật hiển thị trên sơ đồ → Nhân viên

3.1.10 : UC10: Ghi nhận dịch vụ phát sinh
Đối tượng

- Nhân viên (Actor)
- ServiceForm (Boundary)
- ServiceController (Control)
- Booking (Entity)
- AdditionalService (Entity)

 Luồng cơ bản
1. Nhân viên chọn đơn đang lưu trú (hoặc phòng đang ở) → ServiceForm
2. ServiceForm gửi yêu cầu getActiveBooking(roomId) → ServiceController
3. ServiceController gọi findActiveByRoom(roomId) → Booking
4. Booking trả về thông tin đơn đang lưu trú → ServiceController
5. ServiceController trả về thông tin đơn → ServiceForm
6. ServiceForm hiển thị form dịch vụ phát sinh → Nhân viên
7. Nhân viên chọn loại dịch vụ (Minibar, giặt ủi, ăn uống...), số lượng, ghi chú và nhấn "Thêm" → ServiceForm
8. ServiceForm gửi yêu cầu addService(bookingId, serviceType, quantity, note) → ServiceController
9. ServiceController gọi calculatePrice(serviceType, quantity) → AdditionalService
10. AdditionalService trả về giá tiền → ServiceController
11. ServiceController gọi saveService(bookingId, serviceInfo) → AdditionalService
12. AdditionalService lưu dịch vụ phát sinh → ServiceController
13. ServiceController gọi updateTotalAmount(bookingId) → Booking
14. Booking cập nhật tổng tiền (phòng + dịch vụ phát sinh) → ServiceController
15. ServiceController trả về thành công → ServiceForm
16. ServiceForm hiển thị thông báo đã ghi nhận dịch vụ → Nhân viên

 Luồng phụ

-  Sửa/Xóa dịch vụ vừa ghi nhận sai:
  - Nhân viên chọn dịch vụ cần sửa/xóa → ServiceForm
  - ServiceForm gửi yêu cầu updateService() hoặc deleteService() → ServiceController
  - ServiceController cập nhật/xóa dịch vụ → AdditionalService
  - ServiceController cập nhật lại tổng tiền → Booking
  - ServiceController trả về kết quả → ServiceForm
  - ServiceForm hiển thị thông báo cập nhật → Nhân viên
3.1.11 : UC11: Quản lý thông tin và số lượng phòng (Inventory)
Đối tượng

- Quản trị viên (Actor)
- RoomManagementPage (Boundary)
- RoomManagementController (Control)
- Room (Entity)
- RoomType (Entity)
- Booking (Entity)

Luồng cơ bản

1. Admin nhấn "Quản lý phòng" → RoomManagementPage
2. RoomManagementPage gửi yêu cầu getRoomInventory() → RoomManagementController
3. RoomManagementController gọi getAllRoomTypes() → RoomType
4. RoomType trả về danh sách loại phòng → RoomManagementController
5. RoomManagementController gọi getAllRooms() → Room
6. Room trả về danh sách phòng → RoomManagementController
7. RoomManagementController trả về dữ liệu → RoomManagementPage
8. RoomManagementPage hiển thị danh sách loại phòng và từng phòng → Admin

Luồng: Thêm loại phòng
9. Admin nhấn "Thêm loại phòng" → RoomManagementPage
10. RoomManagementPage hiển thị form (tên, diện tích, tiện nghi, ảnh, số lượng) → Admin
11. Admin nhập thông tin và nhấn "Lưu" → RoomManagementPage
12. RoomManagementPage gửi createRoomType(info) → RoomManagementController
13. RoomManagementController gọi save(roomTypeInfo) → RoomType
14. RoomType lưu và trả về kết quả → RoomManagementController
15. RoomManagementController gọi createRooms(roomTypeId, quantity) → Room
16. Room tạo phòng và trả về kết quả → RoomManagementController
17. RoomManagementController trả về thành công → RoomManagementPage
18. RoomManagementPage cập nhật danh sách → Admin

Luồng: Sửa thông tin
19. Admin chọn loại phòng/phòng → chỉnh thông tin → nhấn "Lưu" → RoomManagementPage
20. RoomManagementPage gửi updateRoomType(id, newInfo) → RoomManagementController
21. RoomManagementController gọi update(id, newInfo) → RoomType hoặc Room
22. RoomType/Room cập nhật và trả kết quả → RoomManagementController
23. RoomManagementController trả về thành công → RoomManagementPage

Luồng: Xóa
24. Admin chọn loại phòng/phòng cần xóa → nhấn "Xóa" → RoomManagementPage
25. RoomManagementPage gửi deleteRoomType(id) → RoomManagementController
26. RoomManagementController gọi checkActiveBookings(roomTypeId) → Booking
27. Booking trả về kết quả kiểm tra → RoomManagementController
28.  Không có đơn đang hoạt động:
    - RoomManagementController gọi delete(id) → RoomType / Room
    - Xóa thành công → RoomManagementPage
29.  Có đơn đang hoạt động:
    - RoomManagementController trả về cảnh báo → RoomManagementPage
    - RoomManagementPage hiển thị cảnh báo: hủy đơn hoặc chuyển phòng trước → Admin

3.1.12 : UC12: Cấu hình giá phòng linh hoạt
Đối tượng

- Quản trị viên (Actor)
- PricingConfigPage (Boundary)
- PricingController (Control)
- RoomPrice (Entity)
- RoomType (Entity)

Luồng cơ bản
1. Admin nhấn "Cấu hình giá" → PricingConfigPage
2. PricingConfigPage gửi yêu cầu getPricingConfig() → PricingController
3. PricingController gọi getAllRoomTypes() → RoomType
4. RoomType trả về danh sách loại phòng → PricingController
5. PricingController gọi getAllPrices() → RoomPrice
6. RoomPrice trả về danh sách giá hiện tại → PricingController
7. PricingController trả về dữ liệu → PricingConfigPage
8. PricingConfigPage hiển thị bảng giá theo loại phòng và khoảng ngày → Admin
9. Admin chọn loại phòng, khoảng ngày (hoặc mùa/ngày lễ), nhập giá → PricingConfigPage
10. Admin nhấn "Lưu" → PricingConfigPage
11. PricingConfigPage gửi savePrice(roomTypeId, dateRange, price, priority) → PricingController
12. PricingController gọi checkOverlap(roomTypeId, dateRange) → RoomPrice
13. RoomPrice trả về kết quả kiểm tra trùng → PricingController
14.  Không trùng ngày:
    - PricingController gọi save(priceConfig) → RoomPrice
    - RoomPrice lưu và trả kết quả → PricingController
    - PricingController trả về thành công → PricingConfigPage
    - PricingConfigPage hiển thị thông báo lưu thành công → Admin
15.  Trùng ngày:
    - PricingController trả về cảnh báo (ưu tiên: ngày lễ > mùa > mặc định) → PricingConfigPage
    - PricingConfigPage hiển thị cảnh báo và đề nghị chỉnh lại → Admin

3.1.13 : UC13: Quản lý và phân quyền tài khoản nhân viên
Đối tượng
- Quản trị viên (Actor)
- StaffManagementPage (Boundary)
- StaffController (Control)
- User (Entity)

Luồng cơ bản
1. Admin nhấn "Quản lý nhân viên" → StaffManagementPage
2. StaffManagementPage gửi yêu cầu getStaffList() → StaffController
3. StaffController gọi findAllStaff() → User
4. User trả về danh sách nhân viên (email, tên, vai trò, trạng thái) → StaffController
5. StaffController trả về danh sách → StaffManagementPage
6. StaffManagementPage hiển thị danh sách nhân viên → Admin

 Luồng: Tạo mới
7. Admin nhấn "Tạo tài khoản" → StaffManagementPage
8. StaffManagementPage hiển thị form (email, tên, mật khẩu tạm, vai trò) → Admin
9. Admin nhập thông tin và nhấn "Lưu" → StaffManagementPage
10. StaffManagementPage gửi createStaff(staffInfo) → StaffController
11. StaffController gọi createUser(staffInfo) → User
12. User lưu tài khoản → StaffController
13. StaffController gửi email kích hoạt → Nhân viên mới (qua hệ thống email)
14. StaffController trả về thành công → StaffManagementPage
15. StaffManagementPage cập nhật danh sách → Admin

 Luồng: Sửa thông tin / Đổi vai trò
16. Admin chọn nhân viên → sửa tên, vai trò, đặt lại mật khẩu → nhấn "Lưu" → StaffManagementPage
17. StaffManagementPage gửi updateStaff(staffId, newInfo) → StaffController
18. StaffController gọi updateUser(staffId, newInfo) → User
19. User cập nhật và trả kết quả → StaffController
20. StaffController trả về thành công → StaffManagementPage

 Luồng: Khóa / Mở khóa
21. Admin chọn tài khoản → nhấn "Khóa" / "Mở khóa" → xác nhận → StaffManagementPage
22. StaffManagementPage gửi toggleLock(staffId) → StaffController
23. StaffController gọi setLockStatus(staffId, isLocked) → User
24. User cập nhật trạng thái → StaffController
25. StaffController trả về thành công → StaffManagementPage
26. StaffManagementPage cập nhật danh sách → Admin

Luồng phụ
- Khóa tài khoản đang đăng nhập:
- Phiên của nhân viên đó có thể bị đăng xuất ở request tiếp theo

3.1.14 : UC14: Thống kê báo cáo doanh thu và hiệu suất phòng
Đối tượng
- Quản trị viên (Actor)
- ReportPage (Boundary)
- ReportController (Control)
- Booking (Entity)
- Room (Entity)

Luồng cơ bản
1. Admin nhấn "Báo cáo/Thống kê" → ReportPage
2. ReportPage hiển thị giao diện chọn kỳ và loại báo cáo → Admin
3. Admin chọn kỳ (ngày/tuần/tháng/năm) và loại báo cáo (doanh thu, occupancy, theo loại phòng) → ReportPage
4. Admin nhấn "Xem báo cáo" → ReportPage
5. ReportPage gửi yêu cầu generateReport(period, type) → ReportController
6. ReportController gọi getBookingsByPeriod(period) → Booking
7. Booking trả về dữ liệu booking theo kỳ → ReportController
8. ReportController gọi getRoomOccupancy(period) → Room
9. Room trả về dữ liệu occupancy → ReportController
10. ReportController tổng hợp và trả về báo cáo → ReportPage
11. ReportPage hiển thị bảng và biểu đồ → Admin
12.  Admin nhấn "Xuất file":
    - ReportPage gửi exportReport(period, type, format) → ReportController
    - ReportController tạo file (Excel/PDF) và trả về link tải → ReportPage
    - ReportPage tải file → Admin

3.1.15 : UC15: Gửi thông báo xác nhận tự động (Email/SMS)
Đối tượng
- Hệ thống tự động (Actor - System Scheduler)
- NotificationService (Boundary)
- NotificationController (Control)
- Booking (Entity)
- NotificationTemplate (Entity)
- NotificationLog (Entity)

Luồng cơ bản
1. Sự kiện xảy ra (đặt phòng, thanh toán thành công, đến thời điểm nhắc) → NotificationService
2. NotificationService gửi yêu cầu triggerNotification(eventType, bookingId) → NotificationController
3. NotificationController gọi getBooking(bookingId) → Booking
4. Booking trả về thông tin đơn (email, tên khách, chi tiết đặt phòng) → NotificationController
5. NotificationController gọi getTemplate(eventType) → NotificationTemplate
6. NotificationTemplate trả về template email/SMS → NotificationController
7. NotificationController điền dữ liệu vào template
8. NotificationController gọi API email/SMS để gửi → Dịch vụ Email/SMS bên ngoài
9.  Gửi thành công:
   - NotificationController gọi logNotification(bookingId, type, "sent") → NotificationLog
   - NotificationLog ghi log → NotificationController
   - NotificationController trả về thành công → NotificationService
10.  Gửi thất bại:
   - NotificationController gọi logNotification(bookingId, type, "failed") → NotificationLog
   - NotificationLog ghi log lỗi → NotificationController
   - Retry theo chính sách (tối đa N lần):
   - NotificationController gọi lại API gửi
   - Nếu thành công: ghi log "sent" và dừng
   - Nếu vẫn thất bại: ghi log "failed" và tiếp tục retry

3.1.16 : UC16: Tự động giải phóng phòng khi hết hạn thanh toán
Đối tượng
Hệ thống tự động (Actor - System Scheduler)
SchedulerService (Boundary)
BookingExpiryController (Control)
Booking (Entity)
Room (Entity)
NotificationController (Control) - tùy chọn

Luồng cơ bản
1. Scheduler chạy theo lịch định kỳ → SchedulerService
2. SchedulerService gửi yêu cầu checkExpiredBookings() → BookingExpiryController
3. BookingExpiryController gọi findExpired(status = "Chờ thanh toán", deadline < now) → Booking
4. Booking trả về danh sách đơn quá hạn → BookingExpiryController
5.  Với mỗi đơn quá hạn:
   - BookingExpiryController gọi updateStatus(bookingId, "Đã hủy") → Booking
   - Booking cập nhật trạng thái → BookingExpiryController
   - BookingExpiryController gọi releaseRoom(roomId) → Room
   - Room cập nhật trạng thái phòng (có thể đặt lại) → BookingExpiryController
   - Gửi email thông báo hủy:
   - BookingExpiryController gọi triggerNotification("booking_cancelled", bookingId) → NotificationController
   - NotificationController gửi email thông báo hủy cho khách
6. BookingExpiryController trả về kết quả xử lý → SchedulerService
7. SchedulerService ghi log hoàn thành

Luồng phụ
-  Đơn đang trong quá trình thanh toán (callback chưa về):
- BookingExpiryController kiểm tra trạng thái = "Đang thanh toán" → Bỏ qua, không hủy
- Chỉ hủy khi trạng thái vẫn là "Chờ thanh toán" sau khi quá hạn
3.2. Biểu đồ tuần tự cho từng Usecase 
3.2.1 : UC01: Đăng ký/Đăng nhập & Quản lý hồ sơ



3.2.2 : UC02: Tìm kiếm và lọc phòng

3.2.3 : UC03: Đặt phòng (Booking)

3.2.4 :  UC04: Thanh toán trực tuyến

3.2.5 : UC05: Xem lịch sử và Hủy đặt phòng

3.2.6 : UC06: Đánh giá và phản hồi dịch vụ

3.2.7 :  UC07: Quản lý sơ đồ phòng thời gian thực (Room Map)

3.2.8 : UC08: Thực hiện Check-in và Check-out


3.2.9 :  UC09: Cập nhật tình trạng dọn dẹp phòng

3.2.10 : UC10: Ghi nhận dịch vụ phát sinh

3.2.11 : UC11: Quản lý thông tin và số lượng phòng (Inventory)

3.2.12 : UC12: Cấu hình giá phòng linh hoạt

3.2.13 : UC13: Quản lý và phân quyền tài khoản nhân viên

3.2.14 : UC14: Thống kê báo cáo doanh thu và hiệu suất phòng

3.2.15 : UC15: Gửi thông báo xác nhận tự động (Email/SMS)

3.2.16 : UC16: Tự động giải phóng phòng khi hết hạn thanh toán

CHƯƠNG 4: BIỂU ĐỒ LỚP VÀ THIẾT KẾ CƠ SỞ DỮ LIỆU
4.1. Biểu đồ lớp (Class Diagram) tổng quát

4.2. Thiết kế cơ sở dữ liệu quan hệ


Tên Bảng
Cột
Kiểu dữ liệu
Ràng buộc
Mô tả
users
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã người dùng


full_name
VARCHAR(255)
NOT NULL
Họ tên đầy đủ


email
VARCHAR(100)
UNIQUE, NOT NULL
Email đăng nhập


phone
VARCHAR(20)
NOT NULL
Số điện thoại


password_hash
VARCHAR(255)
NOT NULL
Mật khẩu đã mã hóa


role
ENUM('customer', 'staff', 'admin')
NOT NULL, DEFAULT 'customer'
Vai trò


status
ENUM('active', 'locked')
NOT NULL, DEFAULT 'active'
Trạng thái tài khoản


created_at
DATETIME
NOT NULL, DEFAULT CURRENT_TIMESTAMP
Thời gian tạo
room_types
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã loại phòng


type_name
VARCHAR(100)
UNIQUE, NOT NULL
Tên loại phòng


area
DECIMAL(5,2)
NOT NULL
Diện tích (m2)


amenities
TEXT


Danh sách tiện nghi (JSON/String)


images
TEXT


URL hình ảnh
rooms
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã phòng


room_number
VARCHAR(10)
UNIQUE, NOT NULL
Số phòng


floor
INT
NOT NULL
Tầng


status
ENUM('Available', 'Booked', 'Occupied', 'Maintenance', 'Dirty')
NOT NULL, DEFAULT 'Available'
Trạng thái phòng


cleaning_status
ENUM('Bẩn', 'Đang dọn', 'Sạch')
NOT NULL, DEFAULT 'Sạch'
Trạng thái dọn dẹp


room_type_id
INT
FOREIGN KEY (room_types.id)
Tham chiếu loại phòng
room_prices
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã giá


room_type_id
INT
FOREIGN KEY (room_types.id)
Tham chiếu loại phòng


start_date
DATE
NOT NULL
Ngày bắt đầu áp dụng


end_date
DATE
NOT NULL
Ngày kết thúc


price
DECIMAL(15,2)
NOT NULL
Giá tiền


priority
INT
DEFAULT 0
Ưu tiên (Lễ > Mùa > Mặc định)
bookings
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã đơn đặt


user_id
INT
FOREIGN KEY (users.id)
Khách hàng đặt


room_id
INT
FOREIGN KEY (rooms.id)
Phòng được đặt


check_in
DATE
NOT NULL
Ngày nhận phòng


check_out
DATE
NOT NULL
Ngày trả phòng


total_amount
DECIMAL(15,2)
NOT NULL
Tổng tiền đơn hàng


status
ENUM('Pending Payment', 'Paid', 'In-house', 'Completed', 'Cancelled')
NOT NULL
Trạng thái đơn


created_at
DATETIME
DEFAULT CURRENT_TIMESTAMP
Thời gian đặt
reviews
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã đánh giá


booking_id
INT
UNIQUE, FOREIGN KEY (bookings.id)
Tham chiếu đơn đặt phòng


rating
INT
CHECK (rating BETWEEN 1 AND 5)
Số sao


comment
TEXT


Nhận xét của khách


created_at
DATETIME
DEFAULT CURRENT_TIMESTAMP
Thời gian đánh giá
additional_services
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã dịch vụ phát sinh


booking_id
INT
FOREIGN KEY (bookings.id)
Thuộc về đơn đặt phòng nào


service_type
VARCHAR(100)
NOT NULL
Loại dịch vụ (Minibar, Giặt ủi...)


quantity
INT
DEFAULT 1
Số lượng


price
DECIMAL(15,2)
NOT NULL
Thành tiền


note
TEXT


Ghi chú thêm
notification_templates
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã mẫu thông báo


event_type
VARCHAR(50)
UNIQUE, NOT NULL
Loại sự kiện (booking_success...)


content
TEXT
NOT NULL
Nội dung mẫu
notification_logs
id
INT
PRIMARY KEY, AUTO_INCREMENT
Mã lịch sử gửi


booking_id
INT
FOREIGN KEY (bookings.id)
Gửi cho đơn nào


type
VARCHAR(20)
NOT NULL
Email hoặc SMS


status
VARCHAR(20)
NOT NULL
Thành công/Thất bại


sent_at
DATETIME
DEFAULT CURRENT_TIMESTAMP
Thời gian gửi


CHƯƠNG 5: THIẾT KẾ GIAO DIỆN (UI/UX – WIREFRAME / MOCKUP)
5.1. Danh sách các trang giao diện chính
Trang chủ
Trang danh sách sản phầm ( có bộ lọc )
Trang giỏ hàng
Trang thanh toán
Trang quản trị:
DashBoard
Quản lý sản phẩm
Quản lý giá
Quản lý đơn hàng
Trang hồ sơ cá nhân / Trang người dùng
Link figma : Figma
5.2. Wireframe / Mockup từng trang 
5.2.1: Trang chủ
Bố cục:
Header (Đầu trang): Logo ở bên trái; Menu điều hướng ở giữa; Nút kêu gọi hành động (CTA) ở bên phải.
Nội dung chính:
Hero Section: Ảnh bìa lớn (Banner) kèm tiêu đề, đoạn mô tả ngắn và thanh công cụ tìm kiếm/đặt phòng nằm đè lên ảnh.
Curated Collections: Danh sách các hạng phòng nổi bật.
Curating Your Private World: Khu vực giới thiệu dịch vụ/tiện ích bằng biểu tượng (icons) và văn bản.
Newsletter: Khu vực đăng ký nhận bản tin ("Join the Inner Circle").
Footer (Chân trang): Chứa logo, thông tin liên hệ, các liên kết phụ (Quy định, Chính sách, Mạng xã hội).
Các thành phần tương tác:
Các liên kết trên Header: Discover, Suites, Amenities.
Nút "Book Now" (Header).
Bộ chọn ngày (Date pickers): Check-in, Check-out.
Dropdown chọn số lượng khách (Guests).
Nút "Check Availability".
Các thẻ phòng (Cards): Có thể click vào ảnh hoặc nút "Explore Collection ->" để xem chi tiết.
Trường nhập văn bản (Input field): Nhập địa chỉ email.
Nút "Subscribe".
Các liên kết dạng text và biểu tượng mạng xã hội ở phần Footer.







5.2.2 : Trang danh sách sản phẩm ( có bộ lọc )
Bố cục:
Header: Giữ nguyên như trang chủ.
Sidebar (Thanh bên trái): Chứa các công cụ lọc tìm kiếm (Search Filters).
Nội dung chính: Khu vực hiển thị kết quả (Available Suites), thanh công cụ sắp xếp, các thẻ danh sách phòng, một trích dẫn (quote) xen kẽ, và thanh phân trang ở dưới cùng.
Các thành phần tương tác:
Thanh trượt/Ô nhập liệu Price Range (Khoảng giá).
Các ô đánh dấu (Checkboxes) trong phần Amenities (Tiện ích).
Các nút dạng tag chọn Suite Type (Loại phòng).
Nút "Reset All Filters" (Xóa bộ lọc).
Dropdown sắp xếp "Sort by: Highest Price / Rating".
Các thẻ phòng (Cards): Có thể click vào toàn bộ thẻ hoặc nút "Details ->".
Thanh phân trang (Pagination): Các nút số "1, 2, 3" và mũi tên ">".



5.2.3 : Trang giỏ hàng
Bố cục:
Header: Giữ nguyên như trang chủ.
Nội dung chính:
Phần trên: Thư viện ảnh (Image Gallery) dạng lưới bất đối xứng.
Phần dưới (chia 2 cột):
Cột trái (Nội dung chi tiết): Tiêu đề, thông số phòng, mô tả, lưới các tiện ích (Curated Amenities), thông tin vị trí kèm bản đồ (In the Heart of History).
Cột phải (Sticky Sidebar): Bảng tóm tắt giá và công cụ đặt phòng cố định khi cuộn trang.
Footer: Giữ nguyên như trang chủ.
Các thành phần tương tác:
Các ảnh thu nhỏ trong Gallery.
Nút overlay "View all 24 photos" trên ảnh cuối cùng.
Bộ chọn ngày Check-in/Check-out và Guests trong khung đặt phòng bên phải.
Nút CTA "Book This Suite".



5.2.4 : Trang thanh toán
Bố cục: Màn hình này sử dụng thiết kế tối giản để giảm phân tâm.
Header: Chỉ gồm Logo và nút quay lại.
Nội dung chính (Chia 2 cột):
Cột trái: Tóm tắt đơn hàng (Selected Suite, thông tin ngày tháng, chi tiết giá tiền).
Cột phải: Biểu mẫu nhập thông tin thanh toán.
Footer: Tối giản, chỉ chứa bản quyền và các liên kết hỗ trợ thiết yếu.
Các thành phần tương tác:
Nút "<- Back to Selection".
Các tab chọn phương thức thanh toán: Credit/Debit Card, Bank Transfer, E-wallet.
Các trường nhập liệu (Input fields): Cardholder Name, Card Number, Expiry Date, CVV.
Checkbox: "Save this payment method for future stays".
Nút CTA xác nhận: "Confirm & Pay $3,567.00".
Các liên kết hỗ trợ ở Footer (Privacy Concierge, Digital Accessibility, Global Support).



5.2.5 : Trang quản trị
Dashboard
Bố cục:
Sidebar (Thanh bên trái): Menu điều hướng dành cho Admin và thông tin người dùng quản trị ở góc dưới.
Nội dung chính: Lời chào, các nút hành động nhanh, 3 thẻ Thống kê tổng quan (KPIs), Biểu đồ xu hướng doanh thu (Revenue Trends), Danh sách đặt phòng gần đây (Recent Bookings), và các thẻ đề xuất dịch vụ (Signature Curations).
Các thành phần tương tác:
Các mục menu trên Sidebar: Dashboard, Bookings, Rooms, Pricing, Settings.
Nút "Generate Report" và "New Booking".
Dropdown bộ lọc thời gian cho biểu đồ: "Last 6 Months".
Liên kết "View All" ở phần Recent Bookings.
Nút nổi (Floating Action Button) dạng icon chat/hỗ trợ màu vàng ở góc dưới bên phải






Quản lý sản phẩm
Bố cục:
Sidebar: Tương tự màn hình Admin, mục "Rooms" đang được chọn.
Nội dung chính: Tiêu đề, nút thao tác, dải 4 thẻ thống kê trạng thái phòng, Danh sách các phòng (hiển thị dạng dòng chi tiết thay vì bảng truyền thống), trích dẫn, và phần phân trang.
Các thành phần tương tác:
Nút "Filter View" và "+ Add New Suite".
Các nút "Quick Control" trên từng dòng phòng: Biểu tượng Cây bút (Chỉnh sửa), Cây chổi (Yêu cầu dọn dẹp), Cờ lê (Yêu cầu bảo trì).
Thanh phân trang (Pagination).
Nút Floating Action Button màu vàng (hỗ trợ).



Quản lý giá
Bố cục:
Sidebar: Tương tự màn hình Admin, mục "Pricing" đang được chọn.
Nội dung chính:
Phần trên: Form cập nhật giá nhanh (Quick Update) bên trái; Lịch biểu chiến lược giá (Monthly Strategy) bên phải.
Phần giữa: 3 thẻ thống kê hiệu suất giá hằng ngày.
Phần dưới: Khu vực dự báo nhu cầu thông minh (Intelligent Demand Forecasting) chứa biểu đồ và thông tin sự kiện sắp tới.
Các thành phần tương tác:
Nút "Download Report" và "+ Create Special Offer".
Trường nhập phần trăm giá thay đổi (Base Rate Adjustment).
Bộ chọn ngày bắt đầu/kết thúc (Start Date / End Date).
Dropdown chọn lý do (Reason / Trigger).
Nút "Apply Update".
Nút chuyển đổi chế độ xem lịch: "Calendar" / "List View".
Nút "View Full Analysis".
Nút Floating Action Button màu vàng (hỗ trợ).



Quản lý đơn hàng
Bố cục:
Sidebar: Tương tự màn hình Admin, mục "Bookings" đang được chọn.
Nội dung chính: Tiêu đề, các nút thao tác chung, 2 thẻ KPI (Live Occupancy, Pending Check-ins), thanh tìm kiếm & lọc, Bảng dữ liệu danh sách khách hàng (Data Table), và phần phân trang.
Các thành phần tương tác:
Nút "Export report" và "New Reservation".
Thanh tìm kiếm (Search bar): Search Guest Identity or Chamber...
Icon Lọc (Filter icon) bên cạnh thanh tìm kiếm.
Các nút hành động nhanh trong bảng: "Check-out", "Check-in", "Wait".
Menu ngữ cảnh 3 chấm dọc ở cuối mỗi dòng dữ liệu.
Thanh phân trang (Pagination).














5.2.6 : Trang hồ sơ cá nhân / Trang người dùng

Link figma : https://www.figma.com/design/ffjy1qXGQ86C06NOnv8dIc/Untitled?node-id=17-22382&t=wtvN5uVZscZOGEYA-1
CHƯƠNG 6: LỰA CHỌN CÔNG CỤ PHÁT TRIỂN HỆ THỐNG
6.1. Giới thiệu các công nghệ dự kiến
Backend: NestJS
FE: NextJS
CSDL: Postgres + ElasticSearch
Cổng thanh toán: Vietcombank API
Vận chuyển: GHTK
Công cụ: Git, Figma, Postman, Vercel
6.2. Lý do lựa chọn và sự phù hợp
Bộ công nghệ này được đánh giá là cực kỳ mạnh mẽ, hiện đại và phản ánh đúng xu hướng phát triển Web hiện nay (Standard Modern Stack).
Công cụ
Ưu điểm chính
Tại sao lại chọn dự án này?
NestJS (Backend)
Cấu trúc Module rõ ràng, sử dụng TypeScript, hiệu năng cao, bảo mật tốt (hỗ trợ sẵn Guard, Interceptor).
Giúp quản lý logic kinh doanh phức tạp (tính giá linh hoạt, quản lý sơ đồ phòng UC07-UC12) một cách khoa học.
NextJS (Frontend)
Tối ưu SEO vượt trội (SSR/SSG), tốc độ tải trang nhanh, trải nghiệm người dùng mượt mà.
 Cực kỳ quan trọng đối với website khách sạn để khách hàng tìm kiếm trên Google (SEO) và truy cập nhanh để đặt phòng. 
Postgres (Database)
Hệ quản trị CSDL quan hệ mạnh mẽ, chuẩn ACID, hỗ trợ tốt các truy vấn phức tạp và dữ liệu JSON.
Đảm bảo tính nhất quán dữ liệu khi đặt phòng và thanh toán (tránh "overbooking"). Phù hợp với schema 9 bảng đã thiết kế.
VCB API
Uy tín lớn tại Việt Nam, độ bảo mật cao, chi phí giao dịch thấp.
Phù hợp với tập khách hàng nội địa, tạo sự tin tưởng khi thực hiện thanh toán tiền đặt phòng lớn.
GHTK (Vận chuyển)
Mạng lưới phủ rộng, tích hợp API dễ dàng, chi phí rẻ.
(Tùy chọn mở rộng) Dùng để gửi hợp đồng giấy, thẻ thành viên vật lý hoặc các quà tặng đi kèm cho khách VIP.


Figma
Thiết kế UI/UX trực quan, hỗ trợ cộng tác nhóm tốt.
Để nhóm 4 người dễ dàng thống nhất giao diện trước khi code, giảm thiểu sửa đổi về sau.
Vercel
Deployment "không độ trễ", tối ưu hóa riêng cho NextJS.
Tiết kiệm chi phí vận hành (có gói Free), tự động hóa quy trình CI/CD từ Git.

6.3. Kiến trúc tổng thể dự kiến (nếu cần)
Hệ thống được thiết kế theo mô hình  ‘Client-Server’ truyền thống nhưng phân tách rõ ràng nhiệm vụ (Separation of Concerns).
	Sơ đồ các thành phần (Monolithic/Modular Architecture):



Phương thức giao tiếp: Hệ thống sẽ sử dụng ‘REST API’ vì:
Dễ học & Phổ biến:Phù hợp với quy mô nhóm 4 người, dễ dàng debug bằng ‘Postman’.
tateless: Phù hợp với cơ chế xác thực ‘JWT’ (JSON Web Token) để quản lý phiên làm việc của Khách hàng/Nhân viên/Admin.
Tính tương thích: Dễ dàng tích hợp với các API bên ngoài như VCB hay GHTK vốn cũng sử dụng chuẩn REST.







Link figma : https://www.figma.com/design/ffjy1qXGQ86C06NOnv8dIc/Untitled?node-id=17-22382&t=wtvN5uVZscZOGEYA-1

