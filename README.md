# CHECKPOINT

## Description

**CHECKPOINT** is a full-stack web application for discovering, searching, and managing video games. Users can search a comprehensive database of games, view detailed information, create personalized game lists, and share reviews.

---

## Features

* **Game Search**: Real-time search with autocomplete

  * Single-letter search shows all games starting with that letter
  * Multi-character search shows substring matches
* **Game Database**: Powered by RAWG API

  * Batch fetching and pagination for comprehensive data
* **User Authentication**: JWT-based authentication
* **User Profiles**: Personalized accounts and game lists
* **Reviews**: Write and share game reviews

---

## Tech Stack

**Frontend:**

* React with Vite
* React Router
* CSS

**Backend:**

* Node.js with Express
* MongoDB with Mongoose
* JWT for authentication
* bcrypt for password hashing
* CORS enabled

**External APIs:**

* RAWG Video Games Database API

---

## Installation

### Prerequisites

* Node.js v14+
* MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd Backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the project root:

   ```bash
   cd ..
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the frontend server:

   ```bash
   npm run dev
   ```
4. Open your browser to the provided Vite URL.

---

## Environment Variables

Create a `.env` file in the `Backend` folder with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
API_KEY=your_rawg_api_key
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password_or_app_specific_password
```

---

## Database Schema

### Games Collection

* `id`: Unique game ID
* `name`: Game title
* `slug`: URL-friendly identifier
* `rating`: Average rating
* `released`: Release date
* `background_image`: Cover image URL
* `genres`: Array of genre objects
* `description`: Game description text

### Users Collection

* `username`: Unique username
* `email`: Unique email address
* `password`: Hashed password using bcrypt
* `bio`: User profile biography (optional)
* `friends`: Array of user IDs representing connected friends
* `gameLists`: Array of game IDs in user's custom lists
* `favorites`: Array of favorited game IDs
* `reviews`: Array of review objects containing game references and review text
* `createdAt`: Account creation timestamp
* `updatedAt`: Last profile update timestamp

---

## Development Notes

* todo
---

## Authors

* Vaishnavi Sam
* Ela Defne Erkan
* Anam Siddiqui
* Allison Gao
* Jeffrey Joseph - [jjeffrey0022@gmail.com]

---

## License

This project is licensed under the MIT License.
