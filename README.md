# Classroom Help Queue System

A real-time classroom help queue built with Next.js, TypeScript, Tailwind CSS,
and Firebase.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Copy your Firebase config to `.env.local`

### 3. Create Teacher Account

In Firebase Console → Authentication → Add User:

- Email: teacher@school.edu
- Password: your_secure_password

### 4. Deploy Firestore Rules

Copy the rules from `firestore.rules` to your Firebase Console → Firestore →
Rules

### 5. Run Development Server

```bash
npm run dev
```

Visit:

- Student page: http://localhost:3000/join
- Teacher page: http://localhost:3000/teacher

## Project Structure

```
app/
├── join/page.tsx          # Student join page
├── teacher/page.tsx       # Teacher dashboard
├── layout.tsx             # Root layout
└── page.tsx               # Redirect to join

components/
├── PeriodSelector.tsx     # Period dropdown component
├── ErrorAlert.tsx         # Error message component
├── QueuePosition.tsx      # Student position display
└── QueueList.tsx          # Teacher queue list

lib/
├── firebase.ts            # Firebase initialization
├── firestore.ts           # Firestore operations
├── types.ts               # TypeScript types
└── utils.ts               # Utility functions
```

## Features

✅ Real-time queue updates ✅ Period-based isolation ✅ Code verification ✅
FIFO ordering ✅ Teacher authentication ✅ Mobile-responsive ✅
Projector-friendly teacher view
