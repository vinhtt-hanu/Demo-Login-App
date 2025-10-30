# Hướng Dẫn Triển Khai Ứng Dụng Demo Login Bằng Docker

Tài liệu này hướng dẫn cách triển khai ứng dụng demo login (full-stack với React frontend, Node.js backend, MySQL database) bằng Docker từ đầu, khi bạn chỉ có source code.

## Yêu Cầu Hệ Thống

- **Docker**: Phiên bản 20.10 trở lên
- **Docker Compose**: Phiên bản 1.29 trở lên
- **Git**: Để clone repository (nếu cần)
- **Hệ điều hành**: Linux, macOS hoặc Windows với WSL2

## Bước 1: Chuẩn Bị Source Code

1. Clone repository từ GitHub (hoặc copy source code vào thư mục):
   ```bash
   git clone <repository-url> demo-login-app
   cd demo-login-app
   ```

2. Kiểm tra cấu trúc thư mục:
   ```
   demo-login-app/
   ├── backend/          # Code backend Node.js
   ├── frontend/         # Code frontend React
   ├── docker-compose.yml # Cấu hình Docker Compose
   ├── Dockerfile        # (trong backend/ và frontend/)
   └── README.md
   ```

## Bước 2: Cài Đặt Docker và Docker Compose

### Trên Ubuntu/Debian:
```bash
# Cập nhật package list
sudo apt update

# Cài đặt Docker
sudo apt install docker.io

# Cài đặt Docker Compose
sudo apt install docker-compose

# Khởi động Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Thêm user vào group docker (để chạy docker mà không cần sudo)
sudo usermod -aG docker $USER
# Đăng xuất và đăng nhập lại để áp dụng thay đổi
```

### Trên macOS:
```bash
# Cài đặt Docker Desktop từ https://www.docker.com/products/docker-desktop
# Docker Compose được tích hợp sẵn trong Docker Desktop
```

### Trên Windows:
```bash
# Cài đặt Docker Desktop từ https://www.docker.com/products/docker-desktop
# Bật WSL2 nếu chưa có
```

## Bước 3: Kiểm Tra và Chuẩn Bị Môi Trường

1. Kiểm tra Docker đã cài đặt:
   ```bash
   docker --version
   docker-compose --version
   ```

2. Dừng các service có thể xung đột (nếu có):
   ```bash
   # Trên Linux/macOS, dừng MySQL local nếu đang chạy
   sudo systemctl stop mysql
   sudo systemctl stop mysqld

   # Hoặc trên macOS với Homebrew
   brew services stop mysql

   # Kiểm tra port 3306 có bị chiếm không
   sudo lsof -i :3306
   # Nếu có process, kill nó
   sudo kill -9 <PID>
   ```

## Bước 4: Cấu Hình Ứng Dụng

1. Kiểm tra file `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     db:
       image: mysql:8.0
       environment:
         MYSQL_ROOT_PASSWORD: rootpassword
         MYSQL_DATABASE: demo_login_db
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql

     backend:
       build: ./backend
       ports:
         - "5000:5000"
       depends_on:
         - db
       environment:
         - NODE_ENV=production

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       depends_on:
         - backend

     phpmyadmin:
       image: phpmyadmin/phpmyadmin
       ports:
         - "8080:8080"
       environment:
         PMA_HOST: db
         PMA_PORT: 3306
         PMA_USER: root
         PMA_PASSWORD: rootpassword
       depends_on:
         - db

   volumes:
     mysql_data:
   ```

2. Kiểm tra cấu hình database trong `backend/config/config.json`:
   ```json
   {
     "development": {
       "username": "root",
       "password": "",
       "database": "demo_login_db",
       "host": "localhost",
       "dialect": "mysql",
       "port": 3306
     },
     "production": {
       "username": "root",
       "password": "rootpassword",
       "database": "demo_login_db",
       "host": "db",
       "dialect": "mysql",
       "port": 3306
     }
   }
   ```
   **Lưu ý**: Trong môi trường Docker, sử dụng "production" config với host là "db".

## Bước 5: Xây Dựng và Chạy Ứng Dụng

1. Xây dựng và khởi động tất cả services:
   ```bash
   docker-compose up --build
   ```
   - `--build`: Xây dựng lại images từ Dockerfile
   - Lệnh này sẽ chạy ở foreground, hiển thị logs

2. Hoặc chạy ở background (detached mode):
   ```bash
   docker-compose up --build -d
   ```

3. Theo dõi logs:
   ```bash
   docker-compose logs -f
   ```

## Bước 6: Kiểm Tra Triển Khai

1. Kiểm tra containers đang chạy:
   ```bash
   docker-compose ps
   ```
   Bạn sẽ thấy 4 services: db, backend, frontend, phpmyadmin

2. Kiểm tra từng service:
   - **Frontend**: Mở http://localhost:3000
   - **Backend API**: Kiểm tra http://localhost:5000/api/users
   - **phpMyAdmin**: Mở http://localhost:8080 (user: root, password: rootpassword)

3. Test đăng nhập:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"user1@example.com","password":"password123"}'
   ```

## Bước 7: Quản Lý Ứng Dụng

### Dừng ứng dụng:
```bash
docker-compose down
```

### Dừng và xóa volumes (xóa data):
```bash
docker-compose down -v
```

### Xem logs từng service:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Vào container để debug:
```bash
docker-compose exec backend bash
docker-compose exec db mysql -u root -p
```

## Xử Lý Sự Cố Thường Gặp

### Lỗi "port already in use":
```
Error: ports are not available: exposing port TCP 0.0.0.0:3306 -> 127.0.0.1:0: listen tcp 0.0.0.0:3306: bind: address already in use
```
**Giải pháp**:
```bash
# Tìm process sử dụng port 3306
sudo lsof -i :3306
# Kill process
sudo kill -9 <PID>
# Hoặc dừng MySQL service
sudo systemctl stop mysql
```

### Lỗi build image:
- Kiểm tra Dockerfile có đúng không
- Đảm bảo có internet để download base images
- Xóa cache: `docker system prune -a`

### Database connection failed:
- Đảm bảo service `db` đã start trước `backend`
- Kiểm tra config trong `backend/config/config.json`
- Chờ database khởi tạo xong (có thể mất vài phút)

### Frontend không load được:
- Kiểm tra CORS settings trong backend
- Đảm bảo REACT_APP_API_URL trỏ đúng đến backend

## Cấu Hình Production

1. Tạo file `.env` cho environment variables:
   ```
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret
   ```

2. Sử dụng reverse proxy (nginx) để expose ra internet

3. Cấu hình SSL với Let's Encrypt

4. Monitor với Docker logging và health checks

## Tài Nguyên Tham Khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Node.js Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Lưu ý**: Tài liệu này dành cho môi trường development. Để production, cần thêm security hardening, backup strategy, và monitoring.
