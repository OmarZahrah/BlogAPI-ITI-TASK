# Blog Application Backend

This is a simple full-stack blog backend built with Node.js, Express, MongoDB, and Mongoose. It includes user authentication, role checks, group posting permissions, and image uploads via **ImageKit** (files are accepted with Multer using memory storage, then uploaded to your ImageKit media library).

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (memory storage for multipart parsing)
- ImageKit (`@imagekit/nodejs`)
- Joi
- dotenv

## How to Install and Run

1. Open terminal in this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`.
4. Add your environment values.
5. Start server:
   ```bash
   npm start
   ```

## Environment Setup

Use these keys in `.env`:

```env
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

## API reference

Base path: `/api`. All tables use the same columns: **Method**, **Route**, **Description**, **Auth** (whether a valid JWT is required), **Role** (who may call the route).

### Auth

Authentication routes (JWT in `Authorization: Bearer <token>` or auth cookie, where applicable).

| Method | Route                | Description         | Auth | Role   |
| ------ | -------------------- | ------------------- | ---- | ------ |
| POST   | `/api/auth/register` | Register a new user | No   | Public |
| POST   | `/api/auth/login`    | Log in; returns JWT | No   | Public |

### User

Mongoose model: **User** (`username`, `email`, `password`, `role`).

| Method | Route            | Description                                    | Auth | Role                   |
| ------ | ---------------- | ---------------------------------------------- | ---- | ---------------------- |
| GET    | `/api/users`     | List all users                                 | Yes  | `super-admin`          |
| GET    | `/api/users/:id` | Get one user by id                             | Yes  | Any logged-in user     |
| PUT    | `/api/users/:id` | Update user (own profile or any user if admin) | Yes  | Owner or `super-admin` |
| DELETE | `/api/users/:id` | Delete user (own account or any if admin)      | Yes  | Owner or `super-admin` |

### Post

Mongoose model: **Post** (`title`, `content`, `images`, `author` → User, optional `group` → Group).

| Method | Route                     | Description                                                | Auth     | Role                                 |
| ------ | ------------------------- | ---------------------------------------------------------- | -------- | ------------------------------------ |
| POST   | `/api/posts`              | Create post (multipart: images + fields); optional `group` | Yes      | Logged in; group posting rules apply |
| GET    | `/api/posts`              | List posts (global + group posts you may see)              | Optional | Public or logged-in                  |
| GET    | `/api/posts/user/:userId` | List posts by author                                       | No       | Public                               |
| PUT    | `/api/posts/:id`          | Update post                                                | Yes      | Owner or `super-admin`               |
| DELETE | `/api/posts/:id`          | Delete post                                                | Yes      | Owner or `super-admin`               |

### Group

Mongoose model: **Group** (`name`, `admins`, `members`, `permissions.canPost`).

| Method | Route                               | Description                          | Auth | Role                         |
| ------ | ----------------------------------- | ------------------------------------ | ---- | ---------------------------- |
| POST   | `/api/groups`                       | Create group (creator becomes admin) | Yes  | Logged in                    |
| GET    | `/api/groups`                       | List all groups                      | Yes  | Logged in                    |
| GET    | `/api/groups/:id`                   | Get one group by id                  | Yes  | Logged in                    |
| POST   | `/api/groups/:id/add-member`        | Add a user to the group              | Yes  | Group admin or `super-admin` |
| DELETE | `/api/groups/:id/remove-member`     | Remove a user from the group         | Yes  | Group admin or `super-admin` |
| POST   | `/api/groups/:id/grant-permission`  | Allow a member to post in the group  | Yes  | Group admin or `super-admin` |
| DELETE | `/api/groups/:id/revoke-permission` | Remove posting permission for a user | Yes  | Group admin or `super-admin` |
# BlogAPI-ITI-TASK
