# Job Board AI

An AI-powered job board with automated resume evaluation using OpenAI GPT-4o-mini.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API Key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm run seed
npm run dev
```

Backend runs at: http://localhost:5001

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## 📋 Features

### For Applicants
- 🔍 Browse active job postings
- 📝 Submit applications with resume upload
- 🤖 AI-powered resume evaluation (automatic)
- 📊 Track application status
- ⭐ View AI scores and feedback

### For HR
- 📊 Dashboard with statistics
- 💼 Create and manage job postings
- 👥 Review all applications
- 🤖 View AI evaluation scores
- 📄 Download applicant resumes
- ✅ Accept/reject applications

## 🎨 Tech Stack

### Backend
- Node.js + Express 5
- TypeScript
- SQLite Database
- OpenAI SDK (GPT-4o-mini)
- JWT Authentication
- Multer for file uploads

### Frontend
- React 19 + TypeScript
- Vite
- React Router DOM
- Axios for API calls
- Modern CSS with Glassmorphism
- Responsive Design

## 🔐 Demo Credentials

### HR User
- Email: `hr@jobboard.com`
- Password: `12345678`

### Applicant
- Email: `john.doe@example.com`
- Password: `password123`

Or register a new applicant account!

## 📱 Application Flow

### Applicant Journey
1. Browse jobs (public)
2. Register/Login
3. Apply with resume upload
4. AI evaluates resume automatically
5. Track application status
6. View AI feedback and scores

### HR Journey
1. Login (HR accounts are pre-seeded)
2. View dashboard statistics
3. Create/manage job postings
4. Review applications with AI scores
5. Download resumes
6. Accept or reject candidates

## 🎯 AI Evaluation

When an applicant submits a resume:
1. File is uploaded to the backend
2. Sent to OpenAI for analysis
3. AI generates a score (1-10) and detailed feedback
4. Score < 5: Automatically rejected
5. Score ≥ 5: Moved to HR review
6. HR makes final decision

## 🏗️ Project Structure

```
job-board-ai/
├── backend/              # Express + TypeScript API
│   ├── src/
│   │   ├── config/       # Database, OpenAI config
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, file upload, roles
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── services/     # OpenAI integration
│   │   └── types/        # TypeScript types
│   └── uploads/          # Resume storage
│
└── frontend/             # React + Vite
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth state management
    │   ├── pages/        # All application pages
    │   │   ├── applicant/
    │   │   └── hr/
    │   ├── services/     # API integration
    │   ├── styles/       # CSS files
    │   └── types/        # TypeScript types
    └── public/           # Static assets
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register applicant
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs (Public)
- `GET /api/jobs` - List active jobs
- `GET /api/jobs/:id` - Get job details

### Jobs (HR Only)
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/my-applications` - View own applications
- `GET /api/applications/:id` - View application details

### HR Dashboard
- `GET /api/hr/applications` - List all applications
- `GET /api/hr/applications/:id` - Get application details
- `PUT /api/hr/applications/:id/status` - Update status
- `GET /api/hr/stats` - Dashboard statistics

## 🎨 Design Features

- **Dark Theme**: Modern, professional dark interface
- **Glassmorphism**: Frosted glass effects on cards
- **Vibrant Gradients**: Eye-catching color schemes
- **Smooth Animations**: Professional micro-interactions
- **Responsive Design**: Works on all devices
- **Premium Typography**: Inter font family

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- Protected API routes
- XSS protection

## 🚀 Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5001
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini
DATABASE_PATH=./database.sqlite
UPLOAD_DIR=./uploads
AI_SCORE_THRESHOLD=5
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
```

## 🤝 Contributing

This is a demo project showcasing AI integration with a job board application.

## 📄 License

MIT

## 🎉 Acknowledgments

- OpenAI for GPT-4o-mini
- React team for the amazing framework
- Vite for blazing-fast development

---

Built with ❤️ using React, Node.js, and AI
