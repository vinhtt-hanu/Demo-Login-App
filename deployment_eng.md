# Docker Deployment Guide for Demo Login Application

This guide provides step-by-step instructions for deploying the demo login application (full-stack with React frontend, Node.js backend, MySQL database) using Docker from scratch, when you only have the source code.

## System Requirements

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 1.29 or higher
- **Git**: For cloning repository (if needed)
- **Operating System**: Linux, macOS, or Windows with WSL2

## Step 1: Prepare Source Code

1. Clone the repository from GitHub (or copy source code to directory):
   ```bash
   git clone <repository-url> demo-login-app
   cd demo-login-app
   ```

2. Check directory structure:
   ```
   demo-login-app/
   ├── backend/          # Node.js backend code
   ├── frontend/         # React frontend code
   ├── docker-compose.yml # Docker Compose configuration
   ├── Dockerfile        # (in backend/ and frontend/)
   └── README.md
   ```

## Step 2: Install Docker and Docker Compose

### On Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Docker
sudo apt install docker.io

# Install Docker Compose
sudo apt install docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER
# Log out and log back in to apply changes
```

### On macOS:
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop
# Docker Compose is included in Docker Desktop
```

### On Windows:
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop
# Enable WSL2 if not already enabled
```

## Step 3: Check and Prepare Environment

1. Verify Docker installation:
   ```bash
   docker --version
   docker-compose --version
   ```

2. Stop conflicting services (if any):
   ```bash
   # On Linux/macOS, stop local MySQL if running
   sudo systemctl stop mysql
   sudo systemctl stop mysqld

   # Or on macOS with Homebrew
   brew services stop mysql

   # Check if port 3306 is in use
   sudo lsof -i :3306
   # If there's a process, kill it
   sudo kill -9 <PID>
   ```

## Step 4: Configure Application

1. Check `docker-compose.yml` file:
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

2. Check database configuration in `backend/config/config.json`:
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
   **Note**: In Docker environment, use "production" config with host "db".

## Step 5: Build and Run Application

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```
   - `--build`: Rebuild images from Dockerfile
   - This command runs in foreground, showing logs

2. Or run in background (detached mode):
   ```bash
   docker-compose up --build -d
   ```

3. Monitor logs:
   ```bash
   docker-compose logs -f
   ```

## Step 6: Verify Deployment

1. Check running containers:
   ```bash
   docker-compose ps
   ```
   You should see 4 services: db, backend, frontend, phpmyadmin

2. Test each service:
   - **Frontend**: Open http://localhost:3000
   - **Backend API**: Check http://localhost:5000/api/users
   - **phpMyAdmin**: Open http://localhost:8080 (user: root, password: rootpassword)

3. Test login:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"user1@example.com","password":"password123"}'
   ```

## Step 7: Manage Application

### Stop application:
```bash
docker-compose down
```

### Stop and remove volumes (delete data):
```bash
docker-compose down -v
```

### View logs for each service:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Enter container for debugging:
```bash
docker-compose exec backend bash
docker-compose exec db mysql -u root -p
```

## Common Troubleshooting

### Error "port already in use":
```
Error: ports are not available: exposing port TCP 0.0.0.0:3306 -> 127.0.0.1:0: listen tcp 0.0.0.0:3306: bind: address already in use
```
**Solution**:
```bash
# Find process using port 3306
sudo lsof -i :3306
# Kill process
sudo kill -9 <PID>
# Or stop MySQL service
sudo systemctl stop mysql
```

### Image build error:
- Check Dockerfile is correct
- Ensure internet connection for downloading base images
- Clear cache: `docker system prune -a`

### Database connection failed:
- Ensure `db` service starts before `backend`
- Check config in `backend/config/config.json`
- Wait for database initialization (may take a few minutes)

### Frontend not loading:
- Check CORS settings in backend
- Ensure REACT_APP_API_URL points to correct backend

## Production Configuration

1. Create `.env` file for environment variables:
   ```
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret
   ```

2. Use reverse proxy (nginx) to expose to internet

3. Configure SSL with Let's Encrypt

4. Monitor with Docker logging and health checks

## Reference Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Node.js Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**Note**: This guide is for development environment. For production, additional security hardening, backup strategy, and monitoring are required.
