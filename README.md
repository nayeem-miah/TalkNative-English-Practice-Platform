# TalkNative English Practice Platform

**Live Demo**: [https://talk-native-english-practice-platfo.vercel.app](https://talk-native-english-practice-platfo.vercel.app)

TalkNative is a comprehensive platform designed to help users practice and improve their English communication skills. It features interactive learning, real-time support chat, and a robust admin dashboard for managing users, courses, and announcements.

## 🚀 Key Features

### For Students (Users)
- **Interactive Dashboard**: Track practice progress and enrolled courses.
- **Real-Time Support Chat**: Get instant help from admins with real-time typing indicators and message status (Socket.io).
- **Course Enrollment**: Browse and enroll in various English practice modules.
- **Live Calls**: Practice English directly with native speakers or tutors.
- **Announcements**: Stay updated with the latest news and scheduled maintenance.

### For Administrators
- **Admin Dashboard**: Comprehensive overview of platform metrics.
- **User Management**: Monitor, suspend, or manage student accounts.
- **Support Inbox**: Resolve user tickets efficiently through a live real-time chat interface.
- **Announcement Management**: Create, edit, and publish important notices for all users.
- **Course & Lesson Management**: Add and manage educational content.

## 💻 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), Tailwind CSS, shadcn/ui, Redux Toolkit (RTK Query), Socket.io Client.
- **Backend**: Node.js, Express.js, Socket.io (Real-time).
- **Database**: MongoDB with [Prisma ORM](https://www.prisma.io/).
- **Language**: TypeScript (Full Stack).

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- npm or yarn or pnpm
- MongoDB URI (for the backend)

### Installation

1. **Clone the repository** (if applicable):
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

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the necessary variables:
   ```env
   NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

- `/src/app`: Contains all the Next.js pages and routing (App Router).
- `/src/components`: Reusable UI components (including shadcn/ui).
- `/src/redux`: State management and API integration using RTK Query.
- `/src/app/admin`: Dedicated routes for the administrative panel.
- `/src/app/dashboard`: Dedicated routes for the student/user panel.

## 📄 License

This project is proprietary and confidential.
