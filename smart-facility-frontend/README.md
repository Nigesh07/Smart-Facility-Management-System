# Smart Facility Management System — Frontend

React + Vite + Tailwind CSS frontend for the Smart Facility Management System.

## Tech Stack
React 18, Vite, Tailwind CSS, React Router DOM, Axios, Context API, Heroicons.

## 1. Prerequisites
- Node.js 18+
- The backend running locally (see `smart-facility-backend/README.md`) or reachable at the URL you configure below

## 2. Setup
```bash
cp .env.example .env
# edit .env if your backend isn't on http://localhost:8080
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## 3. Environment Variables
| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |

## 4. Logging In
There's no public sign-up. Log in with the seeded admin account from the backend (default `admin@smartfacility.com` / `Admin@123`, or whatever you configured), then go to **Manage Users** to create COORDINATOR, TECHNICIAN, and USER accounts.

## 5. Project Structure
```
src
├── components
│   ├── common      Button, Input, Select, Modal, Loader, EmptyState, StatusBadge, FileUploader, NotificationBell, ThemeToggle
│   ├── layout       Sidebar, Header, DashboardLayout, ProtectedRoute, RoleProtectedRoute
│   ├── dashboard    StatCard
│   └── tickets      TicketCard, TicketTable, TicketForm, TicketFilters, AssignTechnicianModal, TicketTimeline
├── pages
│   ├── auth         LoginPage
│   ├── user         UserDashboard, CreateTicketPage, MyTicketsPage, UserTicketDetailsPage
│   ├── coordinator  CoordinatorDashboard, ManageTicketsPage, CoordinatorTicketDetailsPage
│   ├── technician   TechnicianDashboard, AssignedTicketsPage, TechnicianTicketDetailsPage
│   ├── admin        AdminDashboard, ManageUsersPage, ManageCategoriesPage, AllTicketsPage, AdminTicketDetailsPage*
│   └── ProfilePage
├── services         apiClient, authService, ticketService, userService, categoryService, notificationService, uploadService
├── context          AuthContext, ThemeContext
├── hooks            useAuth, useTheme
├── utils            constants, formatDate, getDashboardPathByRole
├── routes           AppRoutes
├── App.jsx
└── main.jsx
```
\* `AdminTicketDetailsPage` is a small addition beyond the original page list — admins can view full ticket details (read-only, no assign/close actions, matching the spec's "admin should not normally assign technicians or update technician work status").

## 6. Design Tokens
Colors are defined as CSS variables in `src/index.css` and mapped into Tailwind via `tailwind.config.js`, so the whole palette swaps automatically when `.dark` is toggled on `<html>` (persisted to `localStorage`, falling back to system preference on first visit). Fonts: **Manrope** for headings, **Inter** for body/UI text, loaded from Google Fonts in `index.html`.

Status colors follow the brief exactly: soft amber (pending), soft blue (assigned), soft purple (in progress), soft green (completed), soft gray (closed), soft red (critical) — each with a light text-on-soft-background variant for badges.

## 7. Known Limitations / Next Steps
- This was built and reviewed without internet/npm registry access in the sandbox, so `npm install` / a real Vite build has **not** been run yet. Run `npm install && npm run dev` locally first. I manually verified every relative import resolves and cross-checked component/service call signatures, but a real build is the final confirmation — please report back anything that surfaces.
- No automated frontend tests included yet.
- Technician-matching-by-category in `AssignTechnicianModal` infers specialization from the category name client-side (e.g. "Electrical" → `ELECTRICAL`); if you rename categories, double-check that mapping still makes sense, or move this logic server-side.
