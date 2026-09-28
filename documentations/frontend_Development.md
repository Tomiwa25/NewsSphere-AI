# Frontend Development

## 1. React Folder Structure

The frontend of NewsSphere AI is built with React and TypeScript to provide a modular, scalable, and maintainable user interface.

### Recommended folder structure

```text
frontend/
  src/
    app/
      App.tsx
      routes.tsx
    components/
      Navbar/
        Navbar.tsx
      NewsCard/
        NewsCard.tsx
      Filters/
        FilterBar.tsx
      Auth/
        LoginForm.tsx
        RegisterForm.tsx
      Layout/
        MainLayout.tsx
      UI/
        Button.tsx
        LoadingSpinner.tsx
        ErrorBanner.tsx
    pages/
      HomePage.tsx
      NewsDetailPage.tsx
      LoginPage.tsx
      RegisterPage.tsx
      SavedArticlesPage.tsx
      ProfilePage.tsx
    features/
      auth/
        authSlice.ts
      news/
        newsSlice.ts
    services/
      api.ts
      authService.ts
      newsService.ts
    hooks/
      useAuth.ts
      useNews.ts
    context/
      AuthContext.tsx
    utils/
      formatDate.ts
      formatCategory.ts
    styles/
      index.css
    main.tsx
```

### Folder responsibilities

- `app/` – application entry and route definitions
- `components/` – reusable UI elements
- `pages/` – full-page views
- `features/` – business logic grouped by domain
- `services/` – API handlers and Axios setup
- `hooks/` – custom reusable hooks
- `context/` – shared state providers
- `utils/` – helper functions
- `styles/` – global styling

---

## 2. Routing Setup

React Router is used to manage navigation between pages in the application.

### Route setup example

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SavedArticlesPage from "./pages/SavedArticlesPage";
import ProfilePage from "./pages/ProfilePage";
import NewsDetailPage from "./pages/NewsDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/saved" element={<SavedArticlesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Route protection

Protected routes can be wrapped in a private route component.

```tsx
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  isAuthenticated: boolean;
  children: React.ReactNode;
};

const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
```

---

## 3. UI Component Creation

The UI is broken into small, reusable components for maintainability and consistency.

### Example `Button` component

```tsx
type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

const Button = ({ label, onClick, variant = "primary" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={variant === "primary"
        ? "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        : "bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
      }
    >
      {label}
    </button>
  );
};

export default Button;
```

### `Navbar` component

```tsx
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-xl text-slate-900">NewsSphere</div>
        <div className="flex gap-4 text-sm text-slate-600">
          <a href="/">Home</a>
          <a href="/saved">Saved</a>
          <a href="/profile">Profile</a>
        </div>
      </div>
    </nav>
  );
};
```

---

## 4. News Cards

News cards are the main component for displaying article previews in the home feed.

### Example `NewsCard` component

```tsx
type NewsCardProps = {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  onReadMore?: () => void;
};

const NewsCard = ({
  title,
  summary,
  source,
  publishedAt,
  imageUrl,
  onReadMore,
}: NewsCardProps) => {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{source}</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{summary}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{publishedAt}</span>
          <button onClick={onReadMore} className="text-blue-600 font-medium">
            Read more
          </button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
```

### Feed layout

```tsx
const NewsFeed = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <NewsCard title="AI startup raises funding" summary="A detailed look at the newest AI funding cycle." source="TechCrunch" publishedAt="2 hours ago" />
      <NewsCard title="Climate initiative expands across regions" summary="New sustainability plans are being rolled out globally." source="Guardian" publishedAt="4 hours ago" />
    </div>
  );
};
```

---

## 5. API Connection using Axios

Axios is used for communicating with the backend REST API.

### Axios setup

```ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

### Example news service

```ts
import api from "./api";

export const getTopHeadlines = async (category = "general") => {
  const response = await api.get(`/news/top-headlines?category=${category}`);
  return response.data;
};

export const searchNews = async (query: string) => {
  const response = await api.get(`/news/search?q=${query}`);
  return response.data;
};
```

### Interceptor for authentication

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

## 6. Authentication Pages

Authentication pages are used for user registration and login.

### Login page example

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // call auth API
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded mb-3"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded mb-3"
        placeholder="Password"
      />
      <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-3 rounded">
        Login
      </button>
    </div>
  );
};

export default LoginPage;
```

### Register page example

```tsx
const RegisterPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <input className="w-full border p-3 rounded mb-3" placeholder="Full name" />
      <input className="w-full border p-3 rounded mb-3" placeholder="Email" />
      <input className="w-full border p-3 rounded mb-3" type="password" placeholder="Password" />
      <button className="w-full bg-blue-600 text-white p-3 rounded">Register</button>
    </div>
  );
};
```

---

## 7. State Management

State management is used to store user authentication status, fetched articles, and UI status.

### Option 1: React Context API

Useful for small to medium applications.

```tsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Option 2: Redux Toolkit

Recommended for larger applications with more state complexity.

```ts
import { createSlice } from "@reduxjs/toolkit";

const newsSlice = createSlice({
  name: "news",
  initialState: { articles: [], loading: false },
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setArticles, setLoading } = newsSlice.actions;
export default newsSlice.reducer;
```

### Suggested state categories

- user authentication state
- news feed state
- saved articles state
- filter/search state
- loading and error state

---

## 8. Responsive UI Implementation

Responsive design is necessary for mobile, tablet, and desktop devices.

### Layout approach

Use utility classes and CSS grid/flexbox to support multiple screen sizes.

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <NewsCard />
    <NewsCard />
    <NewsCard />
  </div>
</div>
```

### Responsive design principles

- mobile-first layout
- flexible grid for cards and sections
- adaptive navigation for smaller screens
- readable typography and spacing
- touch-friendly buttons and controls
- breakpoints using `sm`, `md`, `lg`, and `xl`

### Example responsive navbar

```tsx
<nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
  <div className="font-bold text-lg">NewsSphere</div>
  <div className="flex flex-wrap gap-3 text-sm">
    <a href="/">Home</a>
    <a href="/saved">Saved</a>
    <a href="/profile">Profile</a>
  </div>
</nav>
```

---

## 9. Frontend Integration Workflow

The frontend should follow a standard data flow:

1. User opens a page.
2. Component calls a service function.
3. Axios sends a request to the backend.
4. Backend returns JSON data.
5. Component stores results in local state or global state.
6. UI renders the response.

### Example workflow

```tsx
useEffect(() => {
  const loadNews = async () => {
    const data = await getTopHeadlines("technology");
    setArticles(data.data);
  };

  loadNews();
}, []);
```

---

## 10. Summary

The frontend architecture for NewsSphere AI is designed around React, TypeScript, reusable components, and a clear separation of responsibilities. The application uses routing for page navigation, Axios for API communication, state management for app data, and responsive UI patterns to support all screen sizes. This architecture provides a clean foundation for future growth, including personalization, AI-based relevance, and richer interactive features.
