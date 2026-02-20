# Hireny AI ✨

An AI-powered job board featuring automated resume evaluation via **OpenRouter (Gemini 2.0 Flash)**, built with a premium **Next-Gen UI** featuring Glassmorphism, Bento Grid layouts, and cinematic animations. Refactored to a modern cloud-native stack with **Supabase**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Supabase Project](https://supabase.com/)
- [OpenRouter API Key](https://openrouter.ai/keys)

### Backend Setup
```bash
cd backend
npm install
# Edit .env with SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and OPENROUTER_API_KEY
npm run dev
```
Backend runs at: http://localhost:5001 (Handles AI Evaluation Queue)

### Frontend Setup
```bash
cd frontend
npm install
# Edit .env with VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_API_URL
npm run dev
```
Frontend runs at: http://localhost:5173

## 🎨 Next-Gen UI Features

The application uses the **Aura Design System**:

- **Bento Grid Layout**: Dynamic and responsive grid system for HR Dashboard and Job Listings.
- **Glassmorphism**: Premium "frosted glass" effects with deep backdrop blurs and semi-transparent surfaces.
- **Cinematic Animations**: Powered by **Framer Motion**, featuring stagger effects, smooth page transitions, and micro-interactions.
- **AI Scanning Effect**: Animated laser scanning animation for AI results.
- **Dynamic Glows**: Interactive glowing borders and shadows that react to user hover.
- **Tailwind CSS 3.4**: Modern styling with a custom color palette (Violet to Cyan gradients).
- **Lucide React Icons**: Consistent, high-quality vector icons throughout the app.

## 📋 Features

### For Applicants
- 🔍 **Browse Jobs**: Advanced search and filters with Bento Grid layout.
- 📝 **Apply**: Submit applications with PDF/Docx resume upload directly to Supabase Storage.
- 🤖 **AI Match Score**: Instant resume evaluation with a match score badge powered by OpenRouter.
- 📊 **Track Status**: Real-time updates on application progress.
- ⭐ **AI Feedback**: Detailed feedback from Gemini on how to improve your match.

### For HR
- 📊 **Bento Dashboard**: Interactive statistics with glassmorphism cards.
- 💼 **Job Management**: Create, edit, and manage job postings.
- 👥 **Candidate Review**: Staggered list of applications with AI scores.
- 📄 **Resume Preview**: Direct access to resumes stored in the cloud.
- ✅ **Quick Actions**: Accept or reject applications with glass buttons.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **State/Auth**: Supabase Client SDK
- **Styling**: Tailwind CSS + Custom Aura Design System
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend (Queue Processor)
- **Runtime**: Node.js + Express 5
- **AI Engine**: OpenRouter (Gemini 2.0 Flash)
- **Platform**: Supabase (PostgreSQL, Auth, Storage)
- **File Parsing**: Mammoth (Docx) & PDF-Parse

## 🏗️ Project Structure

```
job-board-ai/
├── frontend/             # Next-Gen React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # GlassCard, Bento components
│   │   │   ├── AIFeedback.tsx
│   │   │   └── LoadingAI.tsx
│   │   ├── pages/        # Applicant & HR pages
│   │   ├── services/     # Direct Supabase interaction
│   │   └── lib/          # Supabase client & utilities
├── backend/              # AI Queue API
│   ├── src/
│   │   ├── config/       # OpenRouter & Supabase Admin config
│   │   ├── services/     # AI Evaluation logic & Queue
│   │   ├── models/       # Supabase database models
│   │   └── server.ts     # Minimal API & Webhook entry
└── ...
```

## 🎯 AI Evaluation Flow

When an applicant submits a resume:
1. **Frontend**: Uploads file to **Supabase Storage** and record to **Database**.
2. **Trigger**: Frontend calls the Backend evaluation endpoint `/api/queue/evaluate/:id`.
3. **Queue**: Backend downloads the resume, extracts text, and sends it to **OpenRouter**.
4. **AI Analysis**: Gemini analyzes the resume against the job description.
5. **Results**: AI generates a **Match Score (1-10)** and feedback, which is saved back to Supabase.
6. **Automation**: Applicants with **Score < 5** are automatically moved to "Rejected" for HR efficiency.

## 📄 License
MIT

---
Built with ❤️ using React, Tailwind, Supabase, and OpenRouter
