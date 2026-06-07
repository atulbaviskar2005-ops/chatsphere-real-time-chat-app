# ChatSphere

Production-style real-time chat application built with React, Vite, Tailwind CSS, Framer Motion, Spring Boot, STOMP WebSockets, JWT, MongoDB, and Cloudinary.

## What Is Included

- JWT register, login, logout, forgot-password placeholder, and change-password flow
- Protected React routes with session restore
- User profile, bio, avatar URL, presence, last seen, and notification preferences
- Real-time private messages via `/app/chat.private` and `/user/queue/messages`
- Real-time group messages via `/app/chat.group` and `/topic/group/{roomId}`
- Message history, edit, delete, reply metadata, timestamps, delivered, and seen status
- Groups with create, join, leave, update, add member, remove member, admins, image, and description
- Cloudinary file upload API for images, videos, PDFs, audio, and documents
- Notifications collection/API and unread count endpoint
- Search endpoints for users, messages, groups, and files
- Premium responsive dark UI with glass panels, sidebar, message bubbles, avatars, online dots, composer, attachments, and micro-interactions

## Local Backend

```bash
cd backend
mvn spring-boot:run
```

Default backend URL: `http://localhost:8080`

Backend environment variables:

```text
PORT=8080
MONGODB_URI=mongodb://localhost:27017/chatsphere_db
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Local Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Frontend `.env`:

```text
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

## MongoDB Atlas

Create a database named `chatsphere_db`. Collections are created automatically by Spring Data, but the app uses:

```text
users
messages
chatRooms
notifications
attachments
```

## Deploy

Render backend:

```text
Build Command: mvn clean package -DskipTests
Start Command: java -jar target/chatsphere-backend-1.0.0.jar
Root Directory: backend
```

Set the backend environment variables from the Local Backend section. `CORS_ALLOWED_ORIGINS` should include your Vercel frontend URL.

Vercel frontend:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Set:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_WS_URL=https://your-render-service.onrender.com/ws
```

## Verify

```bash
cd backend
mvn -q -DskipTests package

cd ../frontend
npm run build
```
