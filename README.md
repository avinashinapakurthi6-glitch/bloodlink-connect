# BloodLink Connect - Advanced Blood Donation Management System

A modern, scalable blood donation management platform built with Next.js, React, TypeScript, and Supabase. Designed to streamline blood inventory tracking, donor coordination, and emergency response.

## 🎯 Features

### Core Functionality
- **Real-time Blood Inventory Tracking** - Monitor blood type availability across locations
- **Shortage Alerts** - Automatic notifications for critical blood shortages
- **Donor Management** - Register and track blood donors with comprehensive profiles
- **Queue Management** - Organize donation requests and appointments
- **Event Management** - Create and manage blood donation drives
- **Certificate Management** - Digital certificates for donors
- **Emergency Response** - Rapid emergency blood request handling
- **AI-Powered Chatbot** - Instant support and information

### Advanced Features
- **Multi-language Support** - Built-in Google Translate integration
- **Real-time Updates** - Live data synchronization with Supabase
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Error Handling** - Comprehensive error reporting and recovery
- **Type Safety** - Full TypeScript support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and API keys

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bloodlink-connect.git
cd bloodlink-connect

# Install dependencies
npm install --legacy-peer-deps

# Configure environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory pages
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── services/         # API service layer
└── visual-edits/     # Visual editing system
```

## 🏗️ Architecture

### Service Layer Pattern
Centralized API management with type-safe responses and consistent error handling.

### Custom Hooks
- `useDataFetch` - Generic data fetching with loading/error states
- `useIsMobile` - Responsive design detection

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

## 📊 Key Pages

- `/dashboard` - Analytics dashboard
- `/alerts` - Blood shortage monitoring
- `/inventory` - Inventory management
- `/queue` - Donation queue
- `/certificates` - Donor certificates
- `/events` - Donation events
- `/emergencies` - Emergency requests

## 🧪 Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run linting
npm start          # Start production server
```

## 📝 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

Built with Next.js, Supabase, Radix UI, and the open-source community.

---

**Built with ❤️ to save lives**
