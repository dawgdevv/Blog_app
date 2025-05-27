# Blog Application

A full-stack blog application that allows users to create, read, update, and delete blog posts.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Comment on blog posts
- User profiles
- Responsive design

## Technologies

- **Frontend**: React.js,Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Architecture

The application follows a **client-server architecture**:

- **Frontend (Client-Side)**:

  - Built with **React.js**, a JavaScript library for building user interfaces. It handles the presentation layer, allowing users to interact with the application.
  - Styled with **Tailwind CSS**, a utility-first CSS framework for rapid UI development.
  - Communicates with the backend via HTTP requests to the defined API endpoints.
  - Manages user sessions and interactions.

- **Backend (Server-Side)**:

  - Developed using **Node.js** and the **Express.js** framework. It provides a RESTful API for the frontend.
  - Handles business logic, including:
    - User authentication and authorization using **JWT (JSON Web Tokens)**.
    - CRUD (Create, Read, Update, Delete) operations for blog posts.
    - Data validation and processing.
  - Interacts with the database to store and retrieve data.

- **Database**:

  - **MongoDB**, a NoSQL document database, is used for data persistence. It stores user information, blog posts, and potentially other related data like comments.

- **Overall Structure**:
  - The frontend and backend are developed as separate concerns but are part of the same project.
  - The backend exposes a set of API endpoints that the frontend consumes to display data and perform actions.
  - This separation allows for independent development and scaling of the frontend and backend components.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dawgdevv/Blog_application
   cd Blog_application
   ```

2. Install dependencies:

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. Environment Configuration:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog_app
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development servers:

   ```bash
   # Run backend and frontend concurrently on seprate terminals
   npm run dev
   ```

5. The application will be running at:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

## API Endpoints

### Authentication

#### Register a new user

- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token with success message

#### Login

- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token with success message

### User Profile

#### Get user profile

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Auth**: Required
- **Response**: User profile object

### Blog Posts

#### Get all blog posts

- **URL**: `/api/blogs/getblogs`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Posts per page (default: 6)
- **Response**:
  ```json
  {
    "blogs": [Array of blog objects],
    "totalPages": "number",
    "currentPage": "number",
    "totalCount": "number"
  }
  ```

#### Get single blog post

- **URL**: `/api/blogs/getblogs/:id`
- **Method**: `GET`
- **Response**: Blog object with populated author details

#### Create blog post

- **URL**: `/api/blogs/create`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "coverImage": "string"
  }
  ```
- **Response**: Created blog object

#### Update blog post

- **URL**: `/api/blogs/update/:id`
- **Method**: `PUT`
- **Auth**: Required (post owner only)
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "coverImage": "string"
  }
  ```
- **Response**: Updated blog object

#### Delete blog post

- **URL**: `/api/blogs/delete/:id`
- **Method**: `DELETE`
- **Auth**: Required (post owner only)
- **Response**: Deleted blog with success message

#### Get blogs by current user

- **URL**: `/api/blogs/getblogs/user`
- **Method**: `GET`
- **Auth**: Required
- **Response**: Array of blog objects authored by current user

#### Get blogs by specific user

- **URL**: `/api/blogs/getblogs/user/:userId`
- **Method**: `GET`
- **Auth**: Required
- **Response**: Array of blog objects authored by specified user

### Comments

#### Get comments for a blog

- **URL**: `/api/comments/blog/:blogId`
- **Method**: `GET`
- **Response**: Array of comment objects with replies

#### Create comment

- **URL**: `/api/comments/create`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "content": "string",
    "blogId": "string",
    "parentCommentId": "string (optional)"
  }
  ```
- **Response**: Created comment object

#### Update comment

- **URL**: `/api/comments/update/:id`
- **Method**: `PUT`
- **Auth**: Required (comment author only)
- **Body**:
  ```json
  {
    "content": "string"
  }
  ```
- **Response**: Updated comment object

#### Delete comment

- **URL**: `/api/comments/delete/:id`
- **Method**: `DELETE`
- **Auth**: Required (comment author only)
- **Response**: Success message

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
