# TalkNative English Practice Platform

**Live Demo**: [https://talk-native-english-practice-platfo.vercel.app](https://talk-native-english-practice-platfo.vercel.app)

TalkNative is a comprehensive platform designed to help users practice and improve their English communication skills. It features interactive learning, real-time support chat, and a robust admin dashboard for managing users, courses, and announcements.

## 🚀 Key Features

### For Students (Users)
- **Interactive Dashboard**: Track practice progress, difficulty levels, and enrolled courses.
- **Google OAuth Login**: Secure and seamless one-click sign-in using Google Authentication.
- **Real-Time Support Chat**: Get instant live help from admins with typing indicators, real-time messaging, and visual sidebar badges showing unread message counts.
- **Real-Time Notifications**: Instant socket-driven alerts featuring real-time unread counters, sleek notification lists with clean dividers, real user avatars, and instant header actions (Mark all read & Clear all).
- **Course Enrollment**: Browse, enroll, and progress through structured English practice modules.
- **Live Calls**: Practice speaking English directly with native speakers and tutors.
- **Announcements**: Stay updated with the latest news, events, and maintenance alerts.

### For Administrators
- **Admin Dashboard**: Comprehensive metrics overview (users, courses, enrollments, and revenue statistics).
- **User Management**: Monitor, review, and suspend student accounts or update user roles.
- **Support Inbox**: Manage and resolve student support tickets with real-time sidebar badges indicating pending tickets with unread messages.
- **Announcement Management**: Create, edit, and publish important notice banners for all users.
- **Course & Lesson Management**: Create, update, and manage structured educational modules and lesson content.

## 💻 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), Tailwind CSS, shadcn/ui, Redux Toolkit (RTK Query), Socket.io Client.
- **Language**: TypeScript.

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nayeem-miah/TalkNative-English-Practice-Platform.git
   cd TalkNative-English-Practice-Platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

## ⚙️ Environment Variables
Create a `.env` file in the root directory and add the necessary variables for the frontend:
```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
```

## 🏃 Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Folder Structure

- `/src/app`: Contains all the Next.js pages and routing (App Router).
- `/src/components`: Reusable UI components (including shadcn/ui).
- `/src/redux`: State management and API integration using RTK Query.
- `/src/app/admin`: Dedicated routes for the administrative panel.
- `/src/app/dashboard`: Dedicated routes for the student/user panel.

## 📄 License

This project is proprietary and confidential.
