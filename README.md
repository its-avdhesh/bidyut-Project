# Bidyut Project - Cloud-Native Web Application

A modern, full-stack web application built with Node.js, Express, and EJS, deployed with Docker on AWS infrastructure.

## 🏗️ Architecture Overview

This project demonstrates a complete cloud-native deployment pipeline from local development to production on AWS EC2.

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express.js, EJS |
| **Database** | MongoDB Atlas (Cloud) |
| **Containerization** | Docker, Docker Compose |
| **Cloud Hosting** | AWS EC2, AWS ECR |
| **Security** | JWT Authentication, bcrypt, HTTPS |

## 🚀 Deployment Workflow

```
Local Development → Docker Build → Push to ECR → EC2 Deploy → Live Application
```

1. **Local Code** - Development on your machine
2. **Docker Build** - Container image creation
3. **Push to ECR** - Store in AWS Container Registry
4. **EC2 Deploy** - Pull and run on EC2 instance
5. **Live App** - Access via Public IP:3000

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- AWS account with EC2 and ECR access
- Docker and Docker Compose
- Git

## 🛠️ Local Development Setup

### 1. Clone the Repository
```bash
git clone git@github.com:its-avdhesh-avdhesh/bidyut-Project.git
cd bidyut-Project/Code
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `Code` directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Build and Run Locally
```bash
# Build the image
docker build -t bidyut-project .

# Run with Docker Compose
docker-compose up
```

### Docker Configuration
- **Dockerfile**: Multi-stage build for optimization
- **docker-compose.yml**: Local development setup
- **Port**: 3000 (exposed)

## ☁️ AWS Deployment

### 1. Create ECR Repository
```bash
aws ecr create-repository --repository-name bidyut-project --region your-region
```

### 2. Build and Push to ECR
```bash
# Authenticate Docker with ECR
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account.dkr.ecr.your-region.amazonaws.com

# Build and tag
docker build -t bidyut-project .
docker tag bidyut-project:latest your-account.dkr.ecr.your-region.amazonaws.com/bidyut-project:latest

# Push to ECR
docker push your-account.dkr.ecr.your-region.amazonaws.com/bidyut-project:latest
```

### 3. EC2 Deployment
```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Docker on EC2
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Pull and run the image
docker pull your-account.dkr.ecr.your-region.amazonaws.com/bidyut-project:latest
docker run -d -p 3000:3000 --name bidyut-app your-account.dkr.ecr.your-region.amazonaws.com/bidyut-project:latest
```

## 📁 Project Structure

```
Code/
├── src/
│   ├── views/          # EJS templates
│   │   ├── landing.ejs    # Infrastructure dashboard
│   │   ├── login.ejs      # Login page
│   │   ├── register.ejs   # Registration page
│   │   └── dashboard.ejs  # User dashboard
│   ├── controller/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── config/         # Configuration files
│   └── app.js          # Express app setup
├── Dockerfile          # Container configuration
├── docker-compose.yml # Local development
├── package.json        # Dependencies
└── server.js           # Application entry point
```

## 🔐 Authentication System

- **JWT Tokens**: Secure session management
- **bcrypt**: Password hashing
- **Cookie-based**: Token storage
- **Protected Routes**: Authentication middleware

### User Registration/Login Flow
1. Register new account with email/password
2. Password hashed with bcrypt
3. Login generates JWT token
4. Token stored in HTTP-only cookie
5. Protected routes verify token

## 🌐 Application Features

### Infrastructure Dashboard
- **Visual Architecture Overview**: Interactive deployment workflow
- **Technology Stack Display**: Modern card-based layout
- **Authentication Integration**: Seamless register/login tabs
- **Responsive Design**: Mobile-optimized interface

### User Management
- User registration and login
- Secure password handling
- Session management with JWT
- User dashboard after login

## 🔧 API Endpoints

### Authentication
- `POST /user/register` - Create new user
- `POST /user/login` - User authentication
- `GET /logout` - Logout and clear session

### Views
- `GET /` - Infrastructure dashboard (landing page)
- `GET /register` - Registration form
- `GET /login` - Login form
- `GET /dashboard` - User dashboard (protected)

## 🎨 Frontend Technologies

- **EJS Templating**: Server-side rendering
- **Modern CSS**: Glassmorphism, gradients, animations
- **Responsive Design**: Mobile-first approach
- **Interactive UI**: Smooth transitions and micro-interactions

## 📊 Monitoring & Logging

- Application logs via console output
- Docker container monitoring
- AWS CloudWatch integration (optional)
- Error handling and user feedback

## 🔒 Security Best Practices

- Environment variable management
- Input validation and sanitization
- Secure password hashing
- HTTPS enforcement in production
- CORS configuration
- Rate limiting (recommended)

## 🚀 Performance Optimization

- Docker multi-stage builds
- Image optimization
- Efficient database queries
- Responsive image handling
- CSS and JS minification (production)

## 🔄 CI/CD Pipeline (Future Enhancement)

```yaml
# Example GitHub Actions workflow
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker image
        # Build and push to ECR
      - name: Deploy to EC2
        # Update and restart containers
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Timeout**
   ```
   Operation `users.findOne()` buffering timed out after 10000ms
   ```
   **Solution:**
   - Ensure MongoDB Atlas network access allows your EC2 IP
   - Check connection string in `.env` file
   - Verify proper connection options (already configured in db.js)
   - Use `.env.example` as template for production environment

2. **Docker Build Errors**
   - Ensure all dependencies in `package.json`
   - Check Dockerfile syntax

3. **EC2 Deployment**
   - Verify security group allows port 3000
   - Check IAM permissions for ECR access
   - Ensure environment file exists at `/home/ec2-user/.env`

4. **Authentication Issues**
   - Verify JWT_SECRET in environment
   - Check cookie settings

### Debug Commands
```bash
# Check Docker logs
docker logs bidyut-app

# Test MongoDB connection
mongosh your-connection-string

# Verify ECR repository
aws ecr describe-repositories --repository-names bidyut-project

# Check container health
curl -f http://your-ec2-ip:3000
```

## 📈 Scaling Considerations

- **Horizontal Scaling**: Load balancer with multiple EC2 instances
- **Database Scaling**: MongoDB Atlas scaling options
- **CDN Integration**: CloudFront for static assets
- **Caching**: Redis for session storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: avdheshbhadoriya090@gmail.com

---

**Built with ❤️ by Avdhesh Bhadoriya**

*Last updated: March 2026*
