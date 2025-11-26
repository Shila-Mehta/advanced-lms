## 🎓 Advanced Learning Management System (LMS)
A modern, full-stack Learning Management System built with Next.js, Node.js, MongoDB, and TypeScript. This enterprise-grade platform provides comprehensive course management, interactive learning experiences, and multi-role dashboards for administrators, instructors, and students.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) 
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) 
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white) 
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) 



## ✨ Features

Multi-role Dashboards (Admin, Instructor, Student)

Course Management - Create, edit, and organize courses

Interactive Learning - Video lessons, quizzes, and progress tracking

Real-time Progress - Track student advancement and completion

Certificate Generation - Automated certificate issuance

Responsive Design - Mobile-first approach for all devices

## 👥 User Roles

Admin	User management, system analytics, course oversight

Instructor	Course creation, student progress monitoring, content management

Student	Course enrollment, learning progress, certificate earning

## 🛠 Technical Features

JWT Authentication with role-based access control

File Upload for course materials and resources

Progress Tracking with visual indicators

Search & Filtering for courses and content

Responsive UI with modern design principles

RESTful APIs with comprehensive error handling

MongoDB with Mongoose ODM for flexible data modeling

## 🏗 Architecture
text
advanced-lms/
├── 🎨 frontend/                 # Next.js 14+ Application
│   ├── src/app/                # App Router pages
│   ├── src/components/         # Reusable UI components
│   ├── src/redux/              # State management
│   └── src/lib/                # Utilities and configurations
├── ⚙️ backend/                  # Node.js API Server
│   ├── src/controllers/        # Route controllers
│   ├── src/models/             # MongoDB models
│   ├── src/routes/             # API routes
│   └── src/middlewares/        # Authentication & validation
└── 🐳 docker-compose.yml       # Container orchestration
🚀 Quick Start
Prerequisites
Node.js 18+

Docker & Docker Compose

MongoDB (included in Docker setup)

Installation
Clone the repository

bash
git clone https://github.com/your-org/advanced-lms.git
cd advanced-lms
Environment Setup

bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
Configure MongoDB Connection
Edit backend/.env:

env
MONGODB_URI=mongodb://localhost:27017/lms
MONGODB_URI=mongodb://mongodb:27017/lms  # For Docker
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
Docker Deployment (Recommended)

bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
Manual Development Setup

bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
Access Points
Frontend: http://localhost:3000

Backend API: http://localhost:5001

MongoDB: localhost:27017

MongoDB Express (if enabled): http://localhost:8081

🛠 Technology Stack
Frontend
Framework: Next.js 14+ with App Router

Language: TypeScript

Styling: Tailwind CSS + Custom Components

State Management: Redux Toolkit

UI Library: Radix UI Primitives

Forms: React Hook Form with Validation

Backend
Runtime: Node.js with Express.js

Language: TypeScript

Database: MongoDB with Mongoose ODM

Authentication: Passport.js + JWT

File Handling: Multer for uploads

Security: Helmet, CORS, Rate Limiting

DevOps & Tools
Containerization: Docker & Docker Compose

Database: MongoDB with Mongoose

Development: Hot-reload, ESLint, Prettier

API Testing: Postman/Insomnia collections included

📊 MongoDB Collections
Core Collections
users - User accounts with role-based permissions

courses - Course catalog and metadata

lessons - Individual learning units

enrollments - Student course enrollments and progress

certificates - Course completion certificates

activities - User engagement and progress tracking

Sample Document Structure
javascript
// User Document
{
  _id: ObjectId("..."),
  email: "student@example.com",
  name: "John Doe",
  role: "student",
  avatar: "url-to-avatar",
  preferences: {},
  createdAt: ISODate("2024-01-01"),
  updatedAt: ISODate("2024-01-01")
}

// Course Document
{
  _id: ObjectId("..."),
  title: "Advanced JavaScript",
  description: "Master modern JavaScript",
  instructor: ObjectId("..."),
  category: "programming",
  price: 0,
  lessons: [ObjectId("..."), ObjectId("...")],
  enrolledStudents: [ObjectId("..."), ObjectId("...")],
  isPublished: true,
  createdAt: ISODate("2024-01-01")
}
📚 API Documentation
Authentication Endpoints
http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/me          # Get current user
Course Management
http
GET    /api/courses         # List all courses
POST   /api/courses         # Create new course
GET    /api/courses/:id     # Get course details
PUT    /api/courses/:id     # Update course
DELETE /api/courses/:id     # Delete course
Learning Interface
http
GET  /api/lessons/:id       # Get lesson content
POST /api/progress          # Update learning progress
GET  /api/certificates/:id  # Download certificate
🎨 Component Library
The project includes a comprehensive component system:

Dashboard Components: Role-specific layouts and widgets

UI Primitives: Buttons, inputs, cards, modals, and more

Course Components: Curriculum, lessons, progress trackers

Form Components: Validation, file uploads, rich text editors

🔧 Development
Code Structure
text
src/
├── components/
│   ├── ui/                 # Basic UI components
│   ├── forms/              # Form components
│   ├── dashboard/          # Dashboard-specific components
│   └── common/             # Shared components
├── lib/                    # Utilities and configurations
├── redux/                  # State management slices
└── types/                  # TypeScript definitions
MongoDB Models Location
text
backend/src/models/
├── User.ts
├── Course.ts
├── Lesson.ts
├── Enrollment.ts
├── Certificate.ts
├── Activity.ts
└── index.ts
Key Commands
bash
# Development
npm run dev                 # Start development server
npm run build              # Production build
npm run start              # Start production server

# Database
npm run db:seed            # Seed sample data
npm run db:reset           # Reset database

# Code Quality
npm run lint               # ESLint checking
npm run type-check         # TypeScript validation
npm run format             # Prettier formatting
🔒 Security Features
Authentication: JWT with secure HTTP-only cookies

Authorization: Role-based access control (RBAC)

Input Validation: Comprehensive request validation


CORS: Configured for secure cross-origin requests


MongoDB Injection Protection: Mongoose validation and sanitization

🚢 Deployment
Production Build
bash
# Build all services
docker-compose -f docker-compose.prod.yml up -d

# Or manually
npm run build
npm start

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


🙏 Acknowledgments

UI components inspired by shadcn/ui

Icons provided by Lucide React

Database design patterns from various open-source LMS projects

MongoDB for flexible and scalable data storage

Built with ❤️ for the education community using MongoDB


