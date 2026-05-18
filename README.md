# CHECKPOINT

## Authors

* Vaishnavi Sam - [sam.vaishnavi@gmail.com]
* Ela Defne Erkan - [edefneerkan@gmail.com]
* Anam Siddiqui - [anamgsiddiqui@gmail.com]
* Allison Gao - [Scotoplane@g.ucla.edu]
* Jeffrey Joseph - [jjeffrey0022@gmail.com]

## Description

**CHECKPOINT** is a social cataloging website for video game fans. Users can create profiles to track anything from wishlists to favorite games; create lists of video games for any topic. Rate video games, leave reviews, read and vote on other users’ reviews, and add others as friends. It serves as an extensive database for users to browse information on video games and connect with other users. 
---

## Features

* **Game Search**: Real-time search with autocomplete

  * Single-letter search shows all games starting with that letter
  * Multi-character search shows substring matches
  * Filter through genres and rating as well.
    
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
   npm start
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
* `_id`: MongoDB ObjectId
* `id`: Unique game ID int
* `name`: Game title string
* `slug`: URL-friendly identifier string
* `rating`: Average rating int
* `released`: Release date year-month-day format string
* `background_image`: Cover image URL 
* `genres`: Array of genre objects
* `description`: Game description string
* `__v`: version key for MongoDB

### Gamelists Collection
* `_id`: MongoDB ObjectId
* `userId`: MongoDB ObjectId for user who created list
* `title`: list title string
* `coverImage`: base64 image data 
* `games`: Array of game IDs in the list
* `isPublic`: if others can see list bool
* `createdAt`: ISO 8601 date of when created
* `updatedAt`: ISO 8601 date of when updated
* `__v`: version key for MongoDB

### Reviews Collection
* `_id`: MongoDB ObjectId
* `gameId`: Unique game ID int (same as Games's id field)
* `gameName`: Game title string (same as Games's name field)
* `rating`: 1-5 scoring int
* `reviewText`: review for game string
* `background_image`: Cover image URL 
* `upvotedBy`: Array of userId that have upvoted
* `downvotedBy`: Array of userId that have downvoted
* `createdAt`: ISO 8601 date of when created
* `__v`: version key for MongoDB

### Users Collection
* `_id`: MongoDB ObjectId
* `username`: Unique username string
* `email`: Unique email address string
* `password`: Hashed password using bcrypt string
* `bio`: User profile biography string (optional)
* `profilePicture`: base64 image data 
* `friends`: Array of user IDs representing connected friends
* `lists`: Array of gamelist object IDs
* `isVerified`: whether the user is verified bool
* `emailVerificationCode`: code for email verfication (null after verified)
* `emailVerificationExpiry`: ISO 8601 date for email verfication expiration (null after verified)
* `friendRequestsReceived`: Array of user objectIds who have requested to be friends
* `friendRequestsSent`: Array of user objectIds that this user sent friend requests to
* `friends`: Array of user objectIds that are friends with this user
* `createdAt`: Account creation ISO 8601

---

## License

This project is licensed under the MIT License.
