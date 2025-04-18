# CheckMe - Breast Cancer Screening Platform

CheckMe is a comprehensive platform dedicated to empowering African women in the fight against breast cancer through early detection, education, and personalized care.

## Features

- Beautiful, responsive homepage showcasing CheckMe's mission
- Google Sign-In authentication for secure access
- Patient appointment booking system
- Doctor dashboard for managing appointments
- API-ready frontend designed to integrate with existing backend services

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Authentication**: Google OAuth via @react-oauth/google
- **State Management**: React Query, Context API
- **Forms**: React Hook Form with Zod validation
- **Animation**: Framer Motion
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google OAuth Client ID (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd checkme-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your Google OAuth Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Update the API configuration:
    - Navigate to `src/services/api.ts` and update the `BASE_URL` to your backend API endpoint.

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Integration

The frontend is designed to integrate with a RESTful API backend. The integration points are:

### Authentication
- Google OAuth token verification (`/auth/google`)
- Session validation (`/auth/session`)
- Logout (`/auth/logout`)

### Appointments
- Create appointment (`/appointments`)
- Get all appointments (`/appointments` or `/appointments/me`)
- Update appointment status (`/appointments/:id/status`)
- Cancel appointment (`/appointments/:id/cancel`)

### Users
- Get user profile (`/users/me`)
- Update user profile (`/users/me`)
- Get list of doctors (`/users/doctors`)

All API calls have been set up in `src/services/api.ts` with commented placeholders.

To preview the detailed api, navigate to the swagger-ui

```bash
   http://localhost:5050/api-docs/
  
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── home/          # Homepage-specific components
│   ├── layout/        # Layout components (Header, Footer)
│   └── ui/            # shadcn UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── types/             # TypeScript type definitions
└── config/            # Configuration files
```

## Development Guidelines

- **Code Style**: Follow the established TypeScript and React patterns in the codebase.
- **Component Structure**: Create functional components with proper TypeScript typing.
- **State Management**: Use React Query for server state and Context API for application state.
- **API Integration**: Update the placeholders in the API service with actual endpoints.

## Deployment

1. Run the backend service:
   ```bash
   cd backend
   
   #then run npm start to start the server
   
   npm start
   
   ```

2. Run the frontend service:
   ```bash
      cd frontend
      
      #then run npm start to start the server
      
      npm run dev
      
      ```  

## License

This project is licensed under the MIT License - see the LICENSE file for details.
