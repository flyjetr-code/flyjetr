# FlyJetr 2.0 - Client App (flyjetr.com)

A modern React application for the client-facing side of the jet charter management system. This app handles the client trip forms and guest profile management.

**Note:** This is the client app. The admin app will be separate at `admin.flyjetr.com`.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (see setup below)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication
   - Get your config from Project Settings > General > Your apps
   - Update `src/config/firebase.config.js` with your config

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Landing page with interface overview
│   ├── TripCreation.jsx # Interface #1: Admin trip creation
│   └── ClientTripForm.jsx # Interface #2: Client multi-page form
├── config/             # Configuration files
│   ├── firebase.config.js # Firebase setup
│   └── firestore-models.js # Data models and schemas
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── utils/              # Utility functions
└── App.jsx             # Main application component
```

## 🎯 Interfaces

### Interface #1: Trip Creation (Admin)
- **URL:** `/admin/trip-creation`
- **Purpose:** Internal form for brokers to initiate trips
- **Features:**
  - Contact information collection
  - Flight details and routing
  - Trip type selection
  - Progress tracking

### Interface #2: Client Trip Form
- **URL:** `/client/trip/:tripId`
- **Purpose:** Multi-page form for clients to complete trip details
- **Features:**
  - Luggage manifest
  - Guest profile management
  - Saved guest profiles
  - Catering and transportation requests
  - Multi-page navigation

## 🔧 Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Yup validation
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Styling:** Custom CSS with design system
- **State Management:** React hooks

## 🎨 Design System

Based on the design document specifications:

- **Font:** Plus Jakarta Sans
- **Primary Color:** White (#ffffff)
- **Secondary Color:** Black (#000000)
- **Accent Color:** Red (#e02b20)
- **Text Color:** Grey (#6d5e5e)

## 📊 Data Models

The application uses Firestore collections based on the ERD:

- `contacts` - Client contact information
- `trips` - Trip master records
- `flights` - Individual flight details
- `passengers` - Guest profile information
- `operators` - Aircraft operator details
- `vendors` - Service provider information

## 🔄 Workflow

1. **Trip Creation:** Broker creates trip with flight details
2. **Client Completion:** Client completes guest profiles and preferences
3. **Trip Finalization:** Broker finalizes and confirms trip details

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Standards

This project follows "vibe coding" principles:
- Keep it simple and readable
- Build only what's needed
- Document decisions and changes
- Maintain clean, organized code

See `.cursor/rules/` for detailed coding standards.

## 🔐 Firebase Setup

1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Get your config from Project Settings
5. Update `src/config/firebase.config.js`

### Firestore Security Rules (Development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important:** Update these rules for production!

## 📝 Next Steps

- [ ] Set up Firebase project and configure
- [ ] Implement Firestore data persistence
- [ ] Add form validation and error handling
- [ ] Implement webhook notifications
- [ ] Add authentication and authorization
- [ ] Deploy to Firebase Hosting

## 🤝 Contributing

1. Follow the vibe coding standards
2. Update the vibe log for major changes
3. Document decisions in agent discussions
4. Keep components focused and simple
5. Test thoroughly before committing

## 📄 License

Private project - All rights reserved