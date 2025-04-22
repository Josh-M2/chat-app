# Chat-App

A full-featured, real-time Chat Application built with React + TypeScript (Vite), Node.js, and MongoDB. Designed with a modular architecture, secure authentication, and a responsive UI powered by Tailwind CSS and Socket.IO for real-time communication.

**Tech Stack**
  - **Frontend**
      - React + TypeScript (Vite)

      - Tailwind CSS

      - Socket.IO Client

      - Cloudinary (Image/file storage)

      - Google reCAPTCHA
   
      - DOMPurify for sanitization

  - **Backend**
      - Node.js + Express

      - MongoDB + Mongoose

      - Socket.IO

      - Cloudinary API

      - sanitize-html
   
      - Rate-limiter middleware
   
      - JWT Auth

**Features**
  - **Authentication**

      - Email validation & “email already taken” check

      - Auth verification on first visit

      - Auto-logout on expired/invalid token

      - Sliding token on user requests (token refresh)
   
      - Protected routes across the app
   
      - Rate-limiting on signup/signin
   
      - Google reCAPTCHA protection
        
  - **Chat System**

      - Real-time messaging with Socket.IO

      - Threaded chat

      - Emoji & image/file support up to 25mb (via Cloudinary)

      - Auto-scroll to newest message

      - Red dot indicator for unread messages

      - Active user status

      - Sort chat list by active users

      - Search users

  - **UI/UX**

      - Toggle password visibility

      - Skeleton loaders for chat list and threads

      - auto scroll and transitions

  - **Security**

      - Input sanitization (Frontend: DOMPurify | Backend: sanitize-html)
    
      - Auth-protected routes
    
      - Rate limiting and CAPTCHA against spam
   
**Folder Structure Highlights**
  - **Frontend**

      - assets/ -SVGs
   
      - components/ – UI elements and reusable form elements
   
      - lib/ - reusable logics

      - pages/ – Route-based pages

      - services/ – API & socket logic

      - types/ – TypeScript interfaces
   
  - **Backend**
    
      - config/ - cors, mongodb, socket
        
      - controllers/ – Logic for auth and chat
   
      - lib/ - reusable logics
   
      - middlewares/ – Auth, rate-limiter

      - models/ – Mongoose schemas
   
      - routes/ – Auth & message endpoints
   
**UI Preview**
![image](https://github.com/user-attachments/assets/7988b130-50f9-4bf7-ba64-e4b9c1739d88)

**Getting Started**

Clone the repository:

          git clone https://github.com/your-username/task-manager.git

Install dependencies:
    
- For frontend:
    
            cd client
            npm install
    
- For backend:
    
            cd server
            npm install

Start development:
            
            # Frontend
            npm run dev
            
            # Backend
            npm run start



