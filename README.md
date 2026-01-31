# 🛍️ Project1 - Web Bán Hàng (E-Commerce Platform)

## 📋 Giới Thiệu Dự Án

**Project1-Web-ban-hang** là một nền tảng thương mại điện tử (e-commerce) được xây dựng với kiến trúc **Full-Stack** hiện đại:
- **Backend**: Django REST Framework (Python)
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL + Redis
- **Cloud Storage**: AWS S3

Dự án này cung cấp giải pháp hoàn chỉnh để quản lý bán sản phẩm trực tuyến với các chức năng như quản lý người dùng, sản phẩm, đơn hàng, thanh toán và hệ thống thông báo.

---

## ✨ Tính Năng Chính

### 👤 Quản Lý Người Dùng
- ✅ Đăng ký, đăng nhập, đặt lại mật khẩu
- ✅ Xác thực JWT Token
- ✅ Quản lý hồ sơ cá nhân
- ✅ Lịch sử đơn hàng

### 📦 Quản Lý Sản Phẩm
- ✅ Danh sách sản phẩm với phân loại
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Hình ảnh sản phẩm (lưu trên AWS S3)
- ✅ Quản lý tồn kho
- ✅ Cache với Redis

### 🛒 Giỏ Hàng & Đơn Hàng
- ✅ Thêm/xóa sản phẩm từ giỏ hàng
- ✅ Tạo đơn hàng
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Hủy đơn hàng

### 💳 Thanh Toán
- ✅ Tích hợp Stripe/MoMo
- ✅ Xử lý thanh toán an toàn
- ✅ Xác nhận thanh toán tự động

### 📧 Hệ Thống Thông Báo
- ✅ Email xác nhận đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Thông báo SMS (Twilio)
- ✅ Thông báo trong ứng dụng

### 🚚 Vận Chuyển
- ✅ Tích hợp API GHN/Ahamove
- ✅ Tính phí vận chuyển tự động
- ✅ Theo dõi vận chuyển

---

## 🏗️ Kiến Trúc Hệ Thống

```
Frontend (React + TS + Vite)
         ↓
    API Gateway
         ↓
Backend (Django REST)
    ├─→ PostgreSQL (Database)
    ├─→ Redis (Cache)
    └─→ AWS S3 (Cloud Storage)
```

Xem chi tiết: [docs/module_relationships.md](docs/module_relationships.md)

---

## 📁 Cấu Trúc Thư Mục

```
Project1-Web-ban-hang/
├── backend/                    # Django Backend
│   ├── accounts/               # Quản lý người dùng
│   ├── products/               # Quản lý sản phẩm
│   ├── orders/                 # Quản lý đơn hàng
│   ├── notifications/          # Hệ thống thông báo
│   ├── config/                 # Cấu hình hệ thống
│   └── manage.py               # Django CLI
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── pages/              # Trang chính
│   │   ├── components/         # Component tái sử dụng
│   │   ├── api/                # API Client
│   │   └── router/             # Định tuyến
│   └── package.json
├── docs/                       # Tài liệu
│   ├── module_relationships.md
│   ├── business_process_diagram.md
│   ├── functional_decomposition.md
│   └── security_report.md
└── package.json                # Root package.json
```

---

## 🚀 Hướng Dẫn Cài Đặt

### 📋 Yêu Cầu Hệ Thống
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+

### 1️⃣ Clone Dự Án
```bash
git clone <repository-url>
cd Project1-Web-ban-hang
```

### 2️⃣ Cài Đặt Backend
```bash
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy migrations
python manage.py migrate

# Tạo superuser (admin)
python manage.py createsuperuser

# Chạy development server
python manage.py runserver
```

Backend sẽ chạy tại: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin/`

### 3️⃣ Cài Đặt Frontend
```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## ⚡ Chạy Dự Án

### Option 1: Chạy Backend Riêng
```bash
npm run be
```

### Option 2: Chạy Frontend Riêng
```bash
npm run fe
```

### Option 3: Chạy Cả Backend & Frontend
```bash
npm run dev
```

---



## 🧪 Kiểm Tra & Test

### Tài Khoản Test
- **Admin**: `admin` / `admin123`
- **API Docs**: `http://localhost:8000/api/docs/` (Swagger)

### Chạy Tests Backend
```bash
cd backend
python manage.py test
```

---

## 📊 Mô-đun Chính

| Mô-đun | Chức Năng | Status |
|--------|----------|--------|
| **Accounts** | Xác thực & Quản lý người dùng | ✅ Hoàn thành |
| **Products** | Quản lý sản phẩm & danh mục | ✅ Hoàn thành |
| **Orders** | Quản lý đơn hàng & giỏ hàng | ✅ Hoàn thành |
| **Notifications** | Gửi email/SMS & thông báo | ✅ Hoàn thành |
| **Payments** | Xử lý thanh toán | 🔄 Phát triển |
| **Shipping** | Quản lý vận chuyển | 🔄 Phát triển |

---

## 📚 Tài Liệu Chi Tiết

- [Module Relationships](docs/module_relationships.md) - Sơ đồ mối quan hệ các mô-đun
- [Business Process](docs/business_process_diagram.md) - Quy trình kinh doanh
- [Functional Decomposition](docs/functional_decomposition.md) - Phân rã chức năng
- [Security Report](docs/security_report.md) - Báo cáo bảo mật



## 📝 License

Dự án này được cấp phép dưới MIT License.
