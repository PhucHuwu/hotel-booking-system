
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
THIẾT KẾ HỆ THỐNG - MÔ TẢ VÀ ĐẶC TẢ USECASE CHI TIẾT
1. Bảng danh mục Usecase
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
Thành công: Hiển thị danh sách phòng với giá và hình ảnh. Thất bại: Thông báo và gợi ý đổi ngày/tiêu chí.
Luồng sự kiện chính
1. Khách nhập ngày nhận phòng, ngày trả phòng, số khách (và tùy chọn: hạng phòng, giá, tiện nghi). 2. Khách nhấn Tìm kiếm. 3. Hệ thống kiểm tra tồn phòng trống và áp dụng bộ lọc. 4. Hiển thị danh sách phòng kèm giá. 5. Khách xem chi tiết và chọn để đặt.
Luồng sự kiện phụ
A1: Khoảng ngày không hợp lệ → Thông báo. A2: Không có phòng trống → Gợi ý thay đổi tiêu chí.

UC03: Đặt phòng (Booking)
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách đã chọn phòng và ngày thực hiện đặt phòng: nhập thông tin, xác nhận điều khoản và tạo đơn (trạng thái chờ thanh toán).
Điều kiện tiên quyết
Khách đã chọn phòng còn trống; phòng vẫn còn tại thời điểm đặt.
Điều kiện kết thúc
Thành công: Tạo đơn và chuyển sang thanh toán. Thất bại: Thông báo lỗi, không tạo đơn.
Luồng sự kiện chính
1. Khách chọn phòng và nhấn Đặt phòng. 2. Hệ thống hiển thị form (thông tin khách, ngày, tổng tiền, điều khoản). 3. Khách điền và xác nhận. 4. Hệ thống kiểm tra và tạo đơn. 5. Hiển thị mã đơn và chuyển đến trang thanh toán.
Luồng sự kiện phụ
A1: Khách hủy → Không tạo đơn. A2: Phòng vừa được đặt bởi người khác → Thông báo, đề nghị chọn phòng/ngày khác.

UC04: Thanh toán trực tuyến
Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng (tương tác Cổng thanh toán)
Mô tả
Cho phép khách thanh toán đơn qua cổng (VNPay, MoMo...); hệ thống nhận kết quả và cập nhật trạng thái đơn.
Điều kiện tiên quyết
Có đơn Chờ thanh toán; đơn chưa quá hạn.
Điều kiện kết thúc
Thành công: Cập nhật Đã thanh toán, gửi email xác nhận. Thất bại: Đơn vẫn Chờ thanh toán hoặc bị hủy khi hết hạn.
Luồng sự kiện chính
1. Khách chọn phương thức và xác nhận. 2. Hệ thống chuyển sang cổng. 3. Khách thanh toán trên cổng. 4. Cổng callback về hệ thống. 5. Hệ thống xác thực và cập nhật đơn. 6. Gửi email và hiển thị kết quả.
Luồng sự kiện phụ
A1: Khách đóng trang cổng → Đơn giữ Chờ thanh toán. A2: Thanh toán thất bại → Thông báo, thử lại hoặc chọn phương thức khác. A3: Callback không hợp lệ → Ghi log.

UC05: Tìm kiếm và lọc phòng
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




UC06: Đặt phòng (Booking)
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

UC07: Thanh toán trực tuyến
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

UC08: Xem lịch sử và Hủy đặt phòng
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

UC09: Đánh giá và phản hồi dịch vụ
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

UC10: Quản lý sơ đồ phòng thời gian thực (Room Map)
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

UC11: Thực hiện Check-in và Check-out
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

UC12: Cập nhật tình trạng dọn dẹp phòng
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
1. Nhân viên mở Room Map hoặc danh sách phòng, chọn phòng. 
2. Chọn trạng thái: Bẩn / Đang dọn / Sạch. 
3. Hệ thống lưu và cập nhật ngay trên sơ đồ.
Luồng sự kiện phụ
Không có.

UC13: Ghi nhận dịch vụ phát sinh
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
1. Nhân viên chọn đơn đang lưu trú (hoặc phòng đang ở).
2. Thêm dịch vụ: chọn loại, số lượng, ghi chú. 
3. Hệ thống tính tiền và thêm vào đơn. 
4. Check-out: tổng đơn = phòng + dịch vụ phát sinh.
Luồng sự kiện phụ
A1: Sửa/xóa dịch vụ vừa ghi nhận sai → Cho phép sửa trước khi khóa đơn.

UC14: Quản lý thông tin và số lượng phòng (Inventory)
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

UC15: Cấu hình giá phòng linh hoạt
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
1. Admin vào Cấu hình giá.
2. Chọn loại phòng và khoảng ngày (hoặc mùa/ngày lễ). 
3. Nhập giá (theo đêm hoặc đơn vị). 
4. Hệ thống lưu; trùng ngày thì ưu tiên (ngày lễ > mùa > mặc định).
Luồng sự kiện phụ
A1: Hai bảng giá trùng ngày → Cảnh báo và đề nghị chỉnh lại.

UC16: Quản lý và phân quyền tài khoản nhân viên
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
1. Admin vào Quản lý nhân viên. 
2. Xem danh sách (email, tên, vai trò, trạng thái). 
3. Tạo mới: email, tên, mật khẩu tạm, vai trò → gửi mail kích hoạt.
4. Sửa: đổi tên, vai trò, đặt lại mật khẩu. 5. Khóa/Mở khóa: chọn tài khoản → xác nhận.
Luồng sự kiện phụ
A1: Khóa tài khoản đang đăng nhập → Phiên có thể bị đăng xuất ở request tiếp theo.

UC17: Thống kê báo cáo doanh thu và hiệu suất phòng
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
1. Admin vào Báo cáo/Thống kê. 
2. Chọn kỳ và loại báo cáo (doanh thu, occupancy, theo loại phòng). 
3. Hệ thống truy vấn và hiển thị bảng/biểu đồ. 
4. Admin có thể xuất file.
Luồng sự kiện phụ
Không có.

UC18: Gửi thông báo xác nhận tự động (Email/SMS)
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
1. Sự kiện xảy ra (đặt phòng, thanh toán, đến thời điểm nhắc). 
2. Hệ thống lấy template và dữ liệu.
3. Gọi API email/SMS và gửi. 
4. Cập nhật trạng thái đã gửi (tránh gửi trùng).
Luồng sự kiện phụ
A1: Gửi thất bại → Ghi log, retry theo chính sách.

UC19: Tự động mở cho phép đặt phòng khi hết hạn thanh toán
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
1. Scheduler chạy theo lịch.
 2. Truy vấn đơn: trạng thái = Chờ thanh toán AND thời hạn < now. 
3. Với mỗi đơn: cập nhật Đã hủy, cập nhật trạng thái phòng. 
4. (Tùy chọn) Gửi email thông báo hủy cho khách.
Luồng sự kiện phụ
A1: Đơn đang trong quá trình thanh toán (callback chưa về) → Dùng trạng thái "Đang thanh toán" và chỉ hủy khi quá hạn vẫn Chờ thanh toán.







Đặc tả Usecase chi tiết (tiếp – từ UC05 đến UC16)
UC05: Xem lịch sử và Hủy đặt phòng

Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách xem danh sách đơn đặt phòng (đã thanh toán, chờ thanh toán, đã hủy) và thực hiện hủy đơn trong chính sách cho phép.
Điều kiện tiên quyết
Khách đã đăng nhập.
Điều kiện kết thúc
Thành công: Hiển thị lịch sử đơn; nếu hủy đơn thì cập nhật trạng thái Đã hủy và có thể hoàn tiền theo chính sách. Thất bại: Thông báo lỗi (không được hủy vì quá hạn, đơn không tồn tại).
Luồng sự kiện chính
1. Khách vào mục Lịch sử đặt phòng. 2. Hệ thống hiển thị danh sách đơn (mã, phòng, ngày, trạng thái, tổng tiền). 3. Khách chọn một đơn để xem chi tiết. 4. Nếu đơn được phép hủy: khách nhấn Hủy đơn và xác nhận. 5. Hệ thống cập nhật trạng thái đơn thành Đã hủy, giải phóng phòng và thông báo (và xử lý hoàn tiền nếu có).
Luồng sự kiện phụ
A1: Đơn đã quá thời hạn cho phép hủy → Nút Hủy ẩn hoặc vô hiệu, thông báo chính sách. A2: Đơn chưa thanh toán và quá hạn → Hệ thống tự động hủy (xem UC Tự động giải phóng phòng).


UC06: Đánh giá và phản hồi dịch vụ

Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách sau khi trả phòng gửi đánh giá (sao) và nhận xét về phòng/dịch vụ để hiển thị công khai và phục vụ thống kê.
Điều kiện tiên quyết
1. Khách đã đăng nhập. 2. Khách có ít nhất một đơn đã hoàn thành (đã Check-out).
Điều kiện kết thúc
Thành công: Hệ thống lưu đánh giá và hiển thị (nếu được duyệt hoặc không cần duyệt). Thất bại: Thông báo lỗi (đã đánh giá rồi, đơn không hợp lệ).
Luồng sự kiện chính
1. Khách vào Lịch sử đặt phòng và chọn đơn đã Check-out chưa đánh giá. 2. Khách nhấn Đánh giá. 3. Hệ thống hiển thị form: chọn số sao, nhập nhận xét (tùy chọn). 4. Khách gửi đánh giá. 5. Hệ thống lưu và thông báo cảm ơn; đánh giá có thể hiển thị trên trang phòng/khách sạn.
Luồng sự kiện phụ
A1: Khách đã đánh giá đơn này rồi → Ẩn nút Đánh giá hoặc thông báo "Bạn đã đánh giá". A2: Nội dung vi phạm quy định → Hệ thống từ chối hoặc chuyển duyệt thủ công.


UC07: Quản lý sơ đồ phòng thời gian thực (Room Map)

Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên (Staff/Receptionist)
Mô tả
Cho phép nhân viên xem sơ đồ phòng theo tầng/tòa nhà với trạng thái từng phòng (Trống, Đã đặt, Đang ở, Bảo trì, Bẩn...) và cập nhật trạng thái khi cần.
Điều kiện tiên quyết
Nhân viên đã đăng nhập với quyền xem/sửa sơ đồ phòng.
Điều kiện kết thúc
Thành công: Hiển thị sơ đồ đúng dữ liệu; cập nhật trạng thái được lưu và phản ánh ngay. Thất bại: Thông báo lỗi quyền hoặc lỗi lưu.
Luồng sự kiện chính
1. Nhân viên vào màn hình Room Map. 2. Hệ thống hiển thị sơ đồ phòng (theo tầng/lầu) với màu/icon theo trạng thái. 3. Nhân viên có thể lọc theo tầng, trạng thái. 4. Nhân viên chọn một phòng để xem chi tiết (khách đang ở, ngày trả, ghi chú) hoặc cập nhật trạng thái (ví dụ: Bẩn → Đang dọn → Sạch). 5. Hệ thống lưu và cập nhật hiển thị.
Luồng sự kiện phụ
A1: Mất kết nối → Thông báo, cho thử lại; không ghi đè dữ liệu cũ.


UC08: Thực hiện Check-in và Check-out

Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên thực hiện thủ tục nhận phòng (Check-in) và trả phòng (Check-out) cho khách: xác nhận đơn, cập nhật trạng thái phòng và đơn.
Điều kiện tiên quyết
1. Nhân viên đã đăng nhập. 2. Có đơn đặt phòng đã thanh toán (Check-in) hoặc khách đang ở (Check-out).
Điều kiện kết thúc
Thành công: Check-in → Phòng chuyển Đang ở, đơn chuyển Đang lưu trú. Check-out → Phòng chuyển Bẩn (chờ dọn), đơn chuyển Hoàn thành. Thất bại: Thông báo lỗi (đơn không tồn tại, sai phòng...).
Luồng sự kiện chính
1. Nhân viên tìm khách theo mã đơn hoặc tên/SĐT. 2. Hệ thống hiển thị thông tin đơn (phòng, ngày, khách). 3. Check-in: Nhân viên xác nhận khách và nhấn Check-in → Hệ thống cập nhật trạng thái phòng và đơn. 4. Check-out: Nhân viên xác nhận và nhấn Check-out → Hệ thống cập nhật phòng (Bẩn), đơn (Hoàn thành), có thể in hóa đơn hoặc gửi email.
Luồng sự kiện phụ
A1: Khách trả phòng trễ so với giờ quy định → Hệ thống tính phí trả phòng trễ (nếu có) và hiển thị trên hóa đơn. A2: Đơn chưa thanh toán mà thực hiện Check-in → Cảnh báo hoặc chặn tùy quy định.


UC09: Cập nhật tình trạng dọn dẹp phòng

Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên đánh dấu tình trạng phòng: Bẩn (sau khi khách trả), Đang dọn, Sạch (sẵn sàng cho khách mới).
Điều kiện tiên quyết
Nhân viên đã đăng nhập; phòng tồn tại và không đang ở khách.
Điều kiện kết thúc
Thành công: Trạng thái phòng được cập nhật và hiển thị trên Room Map. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên mở Room Map hoặc danh sách phòng và chọn phòng cần cập nhật. 2. Chọn trạng thái: Bẩn / Đang dọn / Sạch. 3. Hệ thống lưu và cập nhật ngay trên sơ đồ.
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
Nhân viên đã đăng nhập; có đơn đang lưu trú (khách đang ở).
Điều kiện kết thúc
Thành công: Dịch vụ được ghi nhận và cộng vào đơn; khi Check-out hiển thị trong hóa đơn. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên chọn đơn đang lưu trú (hoặc chọn phòng đang ở). 2. Nhấn Thêm dịch vụ và chọn loại (Minibar, giặt ủi...), số lượng, ghi chú. 3. Hệ thống tính tiền và thêm vào đơn. 4. Khi Check-out, tổng đơn bao gồm phòng + dịch vụ phát sinh.
Luồng sự kiện phụ
A1: Sửa/xóa dịch vụ vừa ghi nhận sai → Cho phép sửa trong cùng phiên trước khi khóa đơn.


UC11: Quản lý thông tin và số lượng phòng (Inventory)

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên (Admin)
Mô tả
Cho phép Admin thêm/sửa/xóa loại phòng, số lượng phòng từng loại, thông tin (diện tích, giường, tiện nghi, ảnh, mô tả).
Điều kiện tiên quyết
Admin đã đăng nhập. Không có đơn đang hoạt động gắn với phòng khi xóa hoặc thu hẹp số lượng (hoặc có quy trình chuyển đơn).
Điều kiện kết thúc
Thành công: Danh mục phòng được cập nhật; khách có thể tìm kiếm và đặt phòng theo thông tin mới. Thất bại: Thông báo lỗi (ràng buộc dữ liệu, quyền).
Luồng sự kiện chính
1. Admin vào mục Quản lý phòng. 2. Xem danh sách loại phòng và từng phòng (mã phòng, loại, trạng thái). 3. Thêm loại phòng mới: nhập tên, diện tích, tiện nghi, ảnh, số lượng phòng tạo ra. 4. Sửa: chọn loại/phòng → chỉnh thông tin → lưu. 5. Xóa: chọn (chỉ khi không còn đơn liên quan) → xác nhận → lưu.
Luồng sự kiện phụ
A1: Xóa loại phòng đang có đơn đặt trong tương lai → Cảnh báo, đề nghị hủy đơn hoặc chuyển phòng trước.


UC12: Cấu hình giá phòng linh hoạt

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin thiết lập giá theo ngày, theo mùa, ngày lễ hoặc sự kiện để hệ thống tính giá khi khách tìm kiếm và đặt phòng.
Điều kiện tiên quyết
Admin đã đăng nhập; đã có ít nhất một loại phòng.
Điều kiện kết thúc
Thành công: Giá áp dụng cho các khoảng thời gian tương ứng; tìm kiếm và đặt phòng hiển thị đúng giá. Thất bại: Thông báo lỗi (ngày trùng, định dạng...).
Luồng sự kiện chính
1. Admin vào Cấu hình giá. 2. Chọn loại phòng và khoảng ngày (hoặc chọn mùa/ngày lễ đã định nghĩa). 3. Nhập giá (theo đêm hoặc theo đơn vị). 4. Hệ thống lưu; khi có trùng ngày thì ưu tiên theo quy tắc (ví dụ: ngày lễ > mùa > mặc định).
Luồng sự kiện phụ
A1: Hai bảng giá trùng ngày → Hệ thống cảnh báo và đề nghị chỉnh lại.


UC13: Quản lý và phân quyền tài khoản nhân viên

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin tạo/sửa/khóa tài khoản nhân viên và phân quyền (ví dụ: chỉ Receptionist, chỉ Housekeeping, hoặc cả hai).
Điều kiện tiên quyết
Admin đã đăng nhập.
Điều kiện kết thúc
Thành công: Tài khoản nhân viên được tạo/sửa/khóa; đăng nhập và quyền truy cập đúng vai trò. Thất bại: Thông báo lỗi (email trùng, mật khẩu yếu...).
Luồng sự kiện chính
1. Admin vào Quản lý nhân viên. 2. Xem danh sách tài khoản (email, tên, vai trò, trạng thái). 3. Tạo mới: nhập email, tên, mật khẩu tạm, vai trò → gửi mail kích hoạt hoặc kích hoạt trực tiếp. 4. Sửa: đổi tên, đổi vai trò, đặt lại mật khẩu. 5. Khóa/Mở khóa: chọn tài khoản → Khóa/Mở → xác nhận.
Luồng sự kiện phụ
A1: Khóa tài khoản đang đăng nhập → Phiên hiện tại có thể bị đăng xuất ở lần request tiếp theo.


UC14: Thống kê báo cáo doanh thu và hiệu suất phòng

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin xem báo cáo doanh thu theo ngày/tuần/tháng/năm và tỷ lệ lấp phòng (occupancy), có thể xuất file.
Điều kiện tiên quyết
Admin đã đăng nhập.
Điều kiện kết thúc
Thành công: Hiển thị biểu đồ/bảng số liệu và cho phép xuất (Excel/PDF). Thất bại: Thông báo lỗi (không có dữ liệu, lỗi xuất file).
Luồng sự kiện chính
1. Admin vào mục Báo cáo/Thống kê. 2. Chọn kỳ (ngày/tuần/tháng/năm) và loại báo cáo (doanh thu, occupancy, theo loại phòng...). 3. Hệ thống truy vấn dữ liệu và hiển thị bảng/biểu đồ. 4. Admin có thể xuất file.
Luồng sự kiện phụ
Không có.


UC15: Gửi thông báo xác nhận tự động (Email/SMS)

Mục
Nội dung chi tiết
Tác nhân chính
Hệ thống (System Scheduler / Backend)
Mô tả
Hệ thống tự động gửi email/SMS khi có sự kiện: xác nhận đặt phòng, nhắc thanh toán, xác nhận thanh toán, nhắc Check-in, nhắc Check-out.
Điều kiện tiên quyết
Đã cấu hình dịch vụ gửi email/SMS; có sự kiện kích hoạt (đơn mới, sắp hết hạn thanh toán, sắp đến ngày ở...).
Điều kiện kết thúc
Thành công: Khách/nhân viên nhận được thông báo đúng nội dung. Thất bại: Ghi log lỗi, có thể retry theo cấu hình.
Luồng sự kiện chính
1. Sự kiện xảy ra (đặt phòng, thanh toán, đến thời điểm nhắc...). 2. Hệ thống lấy template và dữ liệu (mã đơn, tên khách, ngày, link...). 3. Gọi API email/SMS và gửi. 4. Cập nhật trạng thái đã gửi (tránh gửi trùng).
Luồng sự kiện phụ
A1: Gửi thất bại (lỗi mạng, sai số điện thoại) → Ghi log, retry theo chính sách.


UC16: Tự động giải phóng phòng khi hết hạn thanh toán

Mục
Nội dung chi tiết
Tác nhân chính
Hệ thống (System Scheduler)
Mô tả
Định kỳ quét các đơn ở trạng thái Chờ thanh toán đã quá thời hạn; tự động chuyển đơn sang Đã hủy và giải phóng phòng để có thể đặt lại.
Điều kiện tiên quyết
Có job/task chạy theo lịch (ví dụ mỗi 5 phút); đơn có trạng thái Chờ thanh toán và thời hạn thanh toán < hiện tại.
Điều kiện kết thúc
Thành công: Đơn chuyển Đã hủy, phòng trở lại có thể đặt; có thể gửi email thông báo hủy cho khách. Thất bại: Ghi log, retry.
Luồng sự kiện chính
1. Scheduler chạy theo lịch. 2. Truy vấn đơn: trạng thái = Chờ thanh toán AND thời hạn thanh toán < now. 3. Với mỗi đơn: cập nhật trạng thái Đã hủy, cập nhật trạng thái phòng (nếu đã tạm giữ). 4. (Tùy chọn) Gửi email thông báo hủy đơn cho khách.
Luồng sự kiện phụ
A1: Đơn đang trong quá trình thanh toán (callback chưa về) → Có thể dùng thêm trạng thái "Đang thanh toán" và chỉ hủy khi quá hạn và vẫn Chờ thanh toán.




Kết quả: Tài liệu đặc tả đầy đủ các usecase của hệ thống đặt phòng khách sạn trực tuyến, sẵn sàng cho giai đoạn thiết kế và lập trình.


UC05: Xem lịch sử và Hủy đặt phòng

Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách xem danh sách đơn đặt phòng (đã thanh toán, chờ thanh toán, đã hủy) và thực hiện hủy đơn trong chính sách cho phép.
Điều kiện tiên quyết
Khách đã đăng nhập.
Điều kiện kết thúc
Thành công: Hiển thị lịch sử đơn; nếu hủy đơn thì cập nhật trạng thái Đã hủy và có thể hoàn tiền theo chính sách. Thất bại: Thông báo lỗi (không được hủy vì quá hạn, đơn không tồn tại).
Luồng sự kiện chính
1. Khách vào mục Lịch sử đặt phòng. 2. Hệ thống hiển thị danh sách đơn (mã, phòng, ngày, trạng thái, tổng tiền). 3. Khách chọn một đơn để xem chi tiết. 4. Nếu đơn được phép hủy: khách nhấn Hủy đơn và xác nhận. 5. Hệ thống cập nhật trạng thái đơn thành Đã hủy, giải phóng phòng và thông báo (và xử lý hoàn tiền nếu có).
Luồng sự kiện phụ
A1: Đơn đã quá thời hạn cho phép hủy → Nút Hủy ẩn hoặc vô hiệu, thông báo chính sách. A2: Đơn chưa thanh toán và quá hạn → Hệ thống tự động hủy (xem UC Tự động giải phóng phòng).


UC06: Đánh giá và phản hồi dịch vụ

Mục
Nội dung chi tiết
Tác nhân chính
Khách hàng
Mô tả
Cho phép khách sau khi trả phòng gửi đánh giá (sao) và nhận xét về phòng/dịch vụ để hiển thị công khai và phục vụ thống kê.
Điều kiện tiên quyết
1. Khách đã đăng nhập. 2. Khách có ít nhất một đơn đã hoàn thành (đã Check-out).
Điều kiện kết thúc
Thành công: Hệ thống lưu đánh giá và hiển thị (nếu được duyệt hoặc không cần duyệt). Thất bại: Thông báo lỗi (đã đánh giá rồi, đơn không hợp lệ).
Luồng sự kiện chính
1. Khách vào Lịch sử đặt phòng và chọn đơn đã Check-out chưa đánh giá. 2. Khách nhấn Đánh giá. 3. Hệ thống hiển thị form: chọn số sao, nhập nhận xét (tùy chọn). 4. Khách gửi đánh giá. 5. Hệ thống lưu và thông báo cảm ơn; đánh giá có thể hiển thị trên trang phòng/khách sạn.
Luồng sự kiện phụ
A1: Khách đã đánh giá đơn này rồi → Ẩn nút Đánh giá hoặc thông báo "Bạn đã đánh giá". A2: Nội dung vi phạm quy định → Hệ thống từ chối hoặc chuyển duyệt thủ công.


UC07: Quản lý sơ đồ phòng thời gian thực (Room Map)

Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên (Staff/Receptionist)
Mô tả
Cho phép nhân viên xem sơ đồ phòng theo tầng/tòa nhà với trạng thái từng phòng (Trống, Đã đặt, Đang ở, Bảo trì, Bẩn...) và cập nhật trạng thái khi cần.
Điều kiện tiên quyết
Nhân viên đã đăng nhập với quyền xem/sửa sơ đồ phòng.
Điều kiện kết thúc
Thành công: Hiển thị sơ đồ đúng dữ liệu; cập nhật trạng thái được lưu và phản ánh ngay. Thất bại: Thông báo lỗi quyền hoặc lỗi lưu.
Luồng sự kiện chính
1. Nhân viên vào màn hình Room Map. 2. Hệ thống hiển thị sơ đồ phòng (theo tầng/lầu) với màu/icon theo trạng thái. 3. Nhân viên có thể lọc theo tầng, trạng thái. 4. Nhân viên chọn một phòng để xem chi tiết (khách đang ở, ngày trả, ghi chú) hoặc cập nhật trạng thái (ví dụ: Bẩn → Đang dọn → Sạch). 5. Hệ thống lưu và cập nhật hiển thị.
Luồng sự kiện phụ
A1: Mất kết nối → Thông báo, cho thử lại; không ghi đè dữ liệu cũ.


UC08: Thực hiện Check-in và Check-out

Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên thực hiện thủ tục nhận phòng (Check-in) và trả phòng (Check-out) cho khách: xác nhận đơn, cập nhật trạng thái phòng và đơn.
Điều kiện tiên quyết
1. Nhân viên đã đăng nhập. 2. Có đơn đặt phòng đã thanh toán (Check-in) hoặc khách đang ở (Check-out).
Điều kiện kết thúc
Thành công: Check-in → Phòng chuyển Đang ở, đơn chuyển Đang lưu trú. Check-out → Phòng chuyển Bẩn (chờ dọn), đơn chuyển Hoàn thành. Thất bại: Thông báo lỗi (đơn không tồn tại, sai phòng...).
Luồng sự kiện chính
1. Nhân viên tìm khách theo mã đơn hoặc tên/SĐT. 2. Hệ thống hiển thị thông tin đơn (phòng, ngày, khách). 3. Check-in: Nhân viên xác nhận khách và nhấn Check-in → Hệ thống cập nhật trạng thái phòng và đơn. 4. Check-out: Nhân viên xác nhận và nhấn Check-out → Hệ thống cập nhật phòng (Bẩn), đơn (Hoàn thành), có thể in hóa đơn hoặc gửi email.
Luồng sự kiện phụ
A1: Khách trả phòng trễ so với giờ quy định → Hệ thống tính phí trả phòng trễ (nếu có) và hiển thị trên hóa đơn. A2: Đơn chưa thanh toán mà thực hiện Check-in → Cảnh báo hoặc chặn tùy quy định.


UC09: Cập nhật tình trạng dọn dẹp phòng

Mục
Nội dung chi tiết
Tác nhân chính
Nhân viên
Mô tả
Cho phép nhân viên đánh dấu tình trạng phòng: Bẩn (sau khi khách trả), Đang dọn, Sạch (sẵn sàng cho khách mới).
Điều kiện tiên quyết
Nhân viên đã đăng nhập; phòng tồn tại và không đang ở khách.
Điều kiện kết thúc
Thành công: Trạng thái phòng được cập nhật và hiển thị trên Room Map. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên mở Room Map hoặc danh sách phòng và chọn phòng cần cập nhật. 2. Chọn trạng thái: Bẩn / Đang dọn / Sạch. 3. Hệ thống lưu và cập nhật ngay trên sơ đồ.
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
Nhân viên đã đăng nhập; có đơn đang lưu trú (khách đang ở).
Điều kiện kết thúc
Thành công: Dịch vụ được ghi nhận và cộng vào đơn; khi Check-out hiển thị trong hóa đơn. Thất bại: Thông báo lỗi.
Luồng sự kiện chính
1. Nhân viên chọn đơn đang lưu trú (hoặc chọn phòng đang ở). 2. Nhấn Thêm dịch vụ và chọn loại (Minibar, giặt ủi...), số lượng, ghi chú. 3. Hệ thống tính tiền và thêm vào đơn. 4. Khi Check-out, tổng đơn bao gồm phòng + dịch vụ phát sinh.
Luồng sự kiện phụ
A1: Sửa/xóa dịch vụ vừa ghi nhận sai → Cho phép sửa trong cùng phiên trước khi khóa đơn.


UC11: Quản lý thông tin và số lượng phòng (Inventory)

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên (Admin)
Mô tả
Cho phép Admin thêm/sửa/xóa loại phòng, số lượng phòng từng loại, thông tin (diện tích, giường, tiện nghi, ảnh, mô tả).
Điều kiện tiên quyết
Admin đã đăng nhập. Không có đơn đang hoạt động gắn với phòng khi xóa hoặc thu hẹp số lượng (hoặc có quy trình chuyển đơn).
Điều kiện kết thúc
Thành công: Danh mục phòng được cập nhật; khách có thể tìm kiếm và đặt phòng theo thông tin mới. Thất bại: Thông báo lỗi (ràng buộc dữ liệu, quyền).
Luồng sự kiện chính
1. Admin vào mục Quản lý phòng. 2. Xem danh sách loại phòng và từng phòng (mã phòng, loại, trạng thái). 3. Thêm loại phòng mới: nhập tên, diện tích, tiện nghi, ảnh, số lượng phòng tạo ra. 4. Sửa: chọn loại/phòng → chỉnh thông tin → lưu. 5. Xóa: chọn (chỉ khi không còn đơn liên quan) → xác nhận → lưu.
Luồng sự kiện phụ
A1: Xóa loại phòng đang có đơn đặt trong tương lai → Cảnh báo, đề nghị hủy đơn hoặc chuyển phòng trước.


UC12: Cấu hình giá phòng linh hoạt

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin thiết lập giá theo ngày, theo mùa, ngày lễ hoặc sự kiện để hệ thống tính giá khi khách tìm kiếm và đặt phòng.
Điều kiện tiên quyết
Admin đã đăng nhập; đã có ít nhất một loại phòng.
Điều kiện kết thúc
Thành công: Giá áp dụng cho các khoảng thời gian tương ứng; tìm kiếm và đặt phòng hiển thị đúng giá. Thất bại: Thông báo lỗi (ngày trùng, định dạng...).
Luồng sự kiện chính
1. Admin vào Cấu hình giá. 2. Chọn loại phòng và khoảng ngày (hoặc chọn mùa/ngày lễ đã định nghĩa). 3. Nhập giá (theo đêm hoặc theo đơn vị). 4. Hệ thống lưu; khi có trùng ngày thì ưu tiên theo quy tắc (ví dụ: ngày lễ > mùa > mặc định).
Luồng sự kiện phụ
A1: Hai bảng giá trùng ngày → Hệ thống cảnh báo và đề nghị chỉnh lại.


UC13: Quản lý và phân quyền tài khoản nhân viên

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin tạo/sửa/khóa tài khoản nhân viên và phân quyền (ví dụ: chỉ Receptionist, chỉ Housekeeping, hoặc cả hai).
Điều kiện tiên quyết
Admin đã đăng nhập.
Điều kiện kết thúc
Thành công: Tài khoản nhân viên được tạo/sửa/khóa; đăng nhập và quyền truy cập đúng vai trò. Thất bại: Thông báo lỗi (email trùng, mật khẩu yếu...).
Luồng sự kiện chính
1. Admin vào Quản lý nhân viên. 2. Xem danh sách tài khoản (email, tên, vai trò, trạng thái). 3. Tạo mới: nhập email, tên, mật khẩu tạm, vai trò → gửi mail kích hoạt hoặc kích hoạt trực tiếp. 4. Sửa: đổi tên, đổi vai trò, đặt lại mật khẩu. 5. Khóa/Mở khóa: chọn tài khoản → Khóa/Mở → xác nhận.
Luồng sự kiện phụ
A1: Khóa tài khoản đang đăng nhập → Phiên hiện tại có thể bị đăng xuất ở lần request tiếp theo.


UC14: Thống kê báo cáo doanh thu và hiệu suất phòng

Mục
Nội dung chi tiết
Tác nhân chính
Quản trị viên
Mô tả
Cho phép Admin xem báo cáo doanh thu theo ngày/tuần/tháng/năm và tỷ lệ lấp phòng (occupancy), có thể xuất file.
Điều kiện tiên quyết
Admin đã đăng nhập.
Điều kiện kết thúc
Thành công: Hiển thị biểu đồ/bảng số liệu và cho phép xuất (Excel/PDF). Thất bại: Thông báo lỗi (không có dữ liệu, lỗi xuất file).
Luồng sự kiện chính
1. Admin vào mục Báo cáo/Thống kê. 2. Chọn kỳ (ngày/tuần/tháng/năm) và loại báo cáo (doanh thu, occupancy, theo loại phòng...). 3. Hệ thống truy vấn dữ liệu và hiển thị bảng/biểu đồ. 4. Admin có thể xuất file.
Luồng sự kiện phụ
Không có.


UC15: Gửi thông báo xác nhận tự động (Email/SMS)

Mục
Nội dung chi tiết
Tác nhân chính
Hệ thống (System Scheduler / Backend)
Mô tả
Hệ thống tự động gửi email/SMS khi có sự kiện: xác nhận đặt phòng, nhắc thanh toán, xác nhận thanh toán, nhắc Check-in, nhắc Check-out.
Điều kiện tiên quyết
Đã cấu hình dịch vụ gửi email/SMS; có sự kiện kích hoạt (đơn mới, sắp hết hạn thanh toán, sắp đến ngày ở...).
Điều kiện kết thúc
Thành công: Khách/nhân viên nhận được thông báo đúng nội dung. Thất bại: Ghi log lỗi, có thể retry theo cấu hình.
Luồng sự kiện chính
1. Sự kiện xảy ra (đặt phòng, thanh toán, đến thời điểm nhắc...). 2. Hệ thống lấy template và dữ liệu (mã đơn, tên khách, ngày, link...). 3. Gọi API email/SMS và gửi. 4. Cập nhật trạng thái đã gửi (tránh gửi trùng).
Luồng sự kiện phụ
A1: Gửi thất bại (lỗi mạng, sai số điện thoại) → Ghi log, retry theo chính sách.


UC16: Tự động giải phóng phòng khi hết hạn thanh toán

Mục
Nội dung chi tiết
Tác nhân chính
Hệ thống (System Scheduler)
Mô tả
Định kỳ quét các đơn ở trạng thái Chờ thanh toán đã quá thời hạn; tự động chuyển đơn sang Đã hủy và giải phóng phòng để có thể đặt lại.
Điều kiện tiên quyết
Có job/task chạy theo lịch (ví dụ mỗi 5 phút); đơn có trạng thái Chờ thanh toán và thời hạn thanh toán < hiện tại.
Điều kiện kết thúc
Thành công: Đơn chuyển Đã hủy, phòng trở lại có thể đặt; có thể gửi email thông báo hủy cho khách. Thất bại: Ghi log, retry.
Luồng sự kiện chính
1. Scheduler chạy theo lịch. 2. Truy vấn đơn: trạng thái = Chờ thanh toán AND thời hạn thanh toán < now. 3. Với mỗi đơn: cập nhật trạng thái Đã hủy, cập nhật trạng thái phòng (nếu đã tạm giữ). 4. (Tùy chọn) Gửi email thông báo hủy đơn cho khách.
Luồng sự kiện phụ
A1: Đơn đang trong quá trình thanh toán (callback chưa về) → Có thể dùng thêm trạng thái "Đang thanh toán" và chỉ hủy khi quá hạn và vẫn Chờ thanh toán.



