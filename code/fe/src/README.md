# Project Structure

## src
Chứa toàn bộ mã nguồn của dự án.

### components
Lưu các thành phần UI tái sử dụng như:
- **Button**: Các loại button tùy chỉnh.
- **Input**: Các field nhập liệu.
- **Modal**: Component popup dùng chung.

### features
Chứa các module lớn, mỗi module có thể gồm các thành phần riêng:
- **auth**: Xử lý đăng nhập, đăng ký, xác thực người dùng.
- **cart**: Quản lý giỏ hàng, thêm/xóa sản phẩm.
- **order**: Quản lý đơn hàng và lịch sử mua hàng.

### layouts
Chứa các layout chính của ứng dụng:
- **LoginLayout**: Layout cho trang đăng nhập.
- **MainLayout**: Layout chung cho các trang chính sau khi đăng nhập.

### pages
Chứa các trang độc lập, tương ứng với các route:
- **LoginPage**: Trang đăng nhập.
- **DashboardPage**: Trang tổng quan.
- **ProfilePage**: Trang thông tin người dùng.

### router
Cấu hình hệ thống route bằng `react-router-dom`, định nghĩa đường dẫn và layout tương ứng.

### utils
Chứa các hàm tiện ích dùng chung:
- **formatDate.ts**: Xử lý định dạng ngày tháng.
- **validateForm.ts**: Xác thực dữ liệu form.
- **fetchData.ts**: Hàm gọi API.

### hooks
Chứa các custom hooks để tái sử dụng logic:
- **useAuth.ts**: Lấy thông tin người dùng, kiểm tra đăng nhập.
- **useCart.ts**: Xử lý giỏ hàng.
- **useWindowSize.ts**: Theo dõi kích thước màn hình.

### store
Quản lý state global bằng Redux hoặc Zustand:
- **cartSlice.ts**: State và action cho giỏ hàng.
- **authSlice.ts**: State đăng nhập, thông tin user.

### styles
Chứa các file Tailwind hoặc CSS global:
- **index.css**: Các biến, reset style.
- **theme.css**: Định nghĩa màu sắc, font.

### assets
Lưu trữ hình ảnh, icon, fonts hoặc file tĩnh:
- **images/**: Ảnh sản phẩm, banner.
- **icons/**: Các file SVG hoặc icon riêng.

### types
Chứa các định nghĩa TypeScript chung:
- **User.ts**: Kiểu dữ liệu người dùng.
- **Product.ts**: Kiểu dữ liệu sản phẩm.

