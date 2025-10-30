# Demo Login App

A full-stack demo application showcasing Docker containerization, ngrok deployment, and basic authentication.

## Features

- User registration and login
- JWT-based authentication
- React frontend with login/register forms
- Node.js/Express backend with Sequelize ORM
- MySQL database with phpMyAdmin
- Docker containerization
- ngrok deployment

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT, bcrypt
- **Containerization**: Docker, Docker Compose
- **Deployment**: ngrok

## Project Structure

```
demo-login-app/
├── backend/                 # Node.js/Express backend
│   ├── models/             # Sequelize models
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   ├── config/             # Database configuration
│   ├── server.js           # Main server file
│   ├── Dockerfile          # Backend Dockerfile
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── App.js          # Main App component
│   │   └── App.css         # App styles
│   ├── Dockerfile          # Frontend Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker Compose configuration
├── .env                     # Environment variables
└── README.md
```

## Setup and Installation

### Prerequisites

- Docker and Docker Compose installed
- ngrok account (for deployment)

### Running with Docker

1. Clone or navigate to the project directory
2. Copy the `.env` file and update values if needed
3. Run the application:

```bash
docker-compose up --build
```

This will start:
- MySQL database on port 3306
- phpMyAdmin on port 8080
- Backend API on port 5000
- Frontend React app on port 3000

### Database Setup

The application automatically runs migrations and seeds the database with demo users when the backend container starts.

Demo users:
- user1@example.com / password123
- user2@example.com / password456

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- phpMyAdmin: http://localhost:8080

## Deployment with ngrok

1. Install ngrok: https://ngrok.com/download
2. Authenticate ngrok: `ngrok authtoken YOUR_AUTH_TOKEN`
3. Expose the frontend port: `ngrok http 3000`
4. Share the generated ngrok URL

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/protected` - Protected route (requires JWT token)

## Environment Variables

Create a `.env` file in the root directory:

```
DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=demo_login_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

## Development

### Backend

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed:all
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## License

This project is for demonstration purposes only.
# Demo-Login-App
