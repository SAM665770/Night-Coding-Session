# 🤖 AI Interview Prep

An AI-powered interview preparation platform that generates personalized technical interview questions and answers based on your role and experience level.

---

## 📖 Description

AI Interview Prep helps developers prepare for technical interviews by leveraging Google's Gemini AI to generate role-specific questions with detailed markdown answers.

Users can create multiple preparation sessions, each tailored to a specific job role and experience level, and revisit them anytime from their dashboard.

---

## ✨ Features

- 🔐 **User Authentication** — Secure JWT-based login and signup  
- 📂 **Session Management** — Create and manage multiple interview prep sessions  
- 🤖 **AI Question Generation** — Role-specific Q&A powered by Google Gemini  
- 📝 **Markdown Answers** — Syntax highlighting, bold text, bullet points, and code blocks  
- 📌 **Pin Questions** — Save important questions for quick access  
- 🎨 **Responsive UI** — Clean interface built with Tailwind CSS  
- ⚡ **Animated Transitions** — Smooth UI animations using Framer Motion  

---

## 🧰 Tech Stack

| Layer | Technology |
|------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4 |
| **Routing** | React Router DOM v7 |
| **Animations** | Framer Motion |
| **HTTP Client** | Axios |
| **Markdown Rendering** | React Markdown, React Syntax Highlighter |
| **Backend** | Node.js, Express.js v5 |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Environment** | dotenv |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas |

---


## 📁 Project Structure

<pre>
AI-Interview-Prep/
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   └── utils/             # Axios instance & API constants
│   │
│   └── vite.config.js
│
├── backend/
│   ├── config/                # Database connection
│   ├── controller/            # Route handlers
│   ├── middlewares/           # JWT authentication
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   └── utils/                 # Gemini prompt templates
│
└── README.md
</pre>


---

## ⚙️ How to Run Locally

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

---

### 4️⃣ Open in Browser

```text
http://localhost:5173
```

---

## 📦 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| POST | `/api/sessions/create` | Create session | ✅ |
| GET | `/api/sessions/my-sessions` | Get user sessions | ✅ |
| GET | `/api/sessions/:id` | Get session details | ✅ |
| POST | `/api/ai/generate-questions` | Generate questions | ✅ |
| POST | `/api/ai/generate-explanation` | Generate explanation | ✅ |

---

## 🌐 Live Demo

👉 **[Visit AI Interview Prep](https://ai-interview-prep-zeta-wheat.vercel.app/)**

---

## 👨‍💻 Author

Developed by **Samridh Palleda**

---

## ⭐ Support

If you found this project helpful:

- ⭐ Star this repository  
- 🍴 Fork it  
- 📢 Share with others  
