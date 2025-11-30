# Docker Setup cho Project1 Web Bán Hàng

## Cấu trúc
- **Backend**: Django + PostgreSQL
- **Frontend**: React (Vite) + Nginx
- **Database**: PostgreSQL 16

## Cách chạy

### 1. Build và khởi động tất cả services
```bash
docker-compose up --build
```

### 2. Chạy ở chế độ background (detached)
```bash
docker-compose up -d
```

### 3. Xem logs
```bash
docker-compose logs -f
```

### 4. Dừng và xóa containers
```bash
docker-compose down
```

### 5. Dừng và xóa cả volumes (xóa database)
```bash
docker-compose down -v
```

## Truy cập

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/

## Tạo superuser (nếu cần)

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Chạy migrations riêng

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

## Cài đặt thêm package Python

1. Thêm vào `backend/requirements.txt`
2. Rebuild container:
```bash
docker-compose up --build backend
```

## Môi trường Development

- Backend sử dụng volume mount `./backend:/app` để hot-reload khi code thay đổi
- Frontend được build static và serve qua Nginx (không hot-reload, cần rebuild để thấy thay đổi)

## Lưu ý

- Database credentials mặc định trong `docker-compose.yml` chỉ dùng cho dev
- Production cần thay đổi credentials và sử dụng secrets
- CORS cần được cấu hình trong Django settings nếu frontend ở domain khác backend
