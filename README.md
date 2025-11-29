# CHECKPOINT
CS 35L

# Authors
Vaishnavi Sam 
Ela Defne Erkan 
Anam Siddiqui
Allison Gao
Jeffrey Joseph - jjeffrey0022@gmail.com

## Project Overview

CHECKPOINT is a full-stack web application for discovering, searching, and managing video games. Users can search through a comprehensive database of games, view detailed information, and build their own game lists.

### Features

- **Game Search**: Real-time search functionality with autocomplete dropdown
  - Single-letter search shows all games starting with that letter (up to 100 results)
  - Multi-character search shows substring matches (up to 10 results)
  - Debounced requests (300ms) to reduce API calls
- **Game Database**: Powered by RAWG
  - Concurrent batch fetching for fast database population
  - Automatic retry logic with exponential backoff
  - Follows pagination links to fetch comprehensive game data
- **User Authentication**: JWT-based authentication system
- **User Profiles**: Personalized user accounts and game lists
- **Reviews**: Users can write and share game reviews

### Project tech

**Frontend:**
- React with Vite
- React Router for navigation
- CSS for styling

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS enabled for cross-origin requests

**External APIs:**
- RAWG Video Games Database API

### Project Structure

```
CHECKPOINT/
├── Frontend/          # React components
│   ├── Auth.jsx       # Authentication context
│   ├── Home.jsx       # Landing page
│   ├── List.jsx       # Game search and list
│   ├── Profile.jsx    # User profile
│   ├── Login.jsx      # Authentication pages
│   └── Review.jsx     # Game reviews
├── Backend/           # Express API server
│   ├── server.js      # Main server file
│   ├── db.js          # MongoDB connection (with fallback)
│   ├── gamedb.js      # RAWG API seeder script
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   │   ├── search.js  # Game search API
│   │   └── users.js   # User management
│   └── middleware/    # Auth middleware
├── src/               # Main app entry
│   ├── App.jsx        # Root component with routing
│   ├── Global.jsx     # Global layout/navbar
│   └── main.jsx       # Vite entry point
└── vite.config.js     # Vite config with proxy

```

### Setup and Installation

**Prerequisites:**
- Node.js (v14+)
- MongoDB (local or Atlas)

**Backend Setup:**
1. Navigate to Backend folder:
   ```
   cd Backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

**Frontend Setup:**
1. Navigate to project root:
   ```
   cd ..
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open browser to the Vite URL

### Key Configuration

**Environment Variables (Backend/.env):**
- `MONGODB_URI`: MongoDB connection string
- `API_KEY`: RAWG API key for game data
- `PORT`: Backend server port
- `JWT_SECRET`: Secret key for JWT token signing
- `EMAIL_USER`: Email address for sending notifications
- `EMAIL_PASS`: Email password or app-specific password 

### Database Schema

**Games Collection:**
- `id`: Unique game ID
- `name`: Game title
- `slug`: URL-friendly identifier
- `rating`: Average rating
- `released`: Release date
- `background_image`: Cover image URL
- `genres`: Array of genre objects
- `description`: Game description text

**Users Collection:**
- `username`: Unique username for the account
- `email`: User's email address (unique)
- `password`: Hashed password using bcrypt
- `bio`: User's profile biography (optional)
- `friends`: Array of user IDs representing connected friends
- `gameLists`: Array of game IDs in user's custom lists
- `favorites`: Array of favorited game IDs
- `reviews`: Array of review objects containing game references and review text
- `createdAt`: Account creation timestamp
- `updatedAt`: Last profile update timestamp

### Development Notes

//todo

