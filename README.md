# ✈️ FlyMate – Flight Booking App

A modern full-stack flight booking web application built using **React (Vite)** for frontend, **TailwindCSS** for styling, and **LocalStorage** for persistent booking/session data. This project simulates a booking system with features for both **users** and **admins**, including flight search, booking, payment simulation, session management, and more.

---

## 🚀 Features

### 👤 User Panel

- 🔍 Search flights with source, destination, date, and filters
- 📄 View detailed flight information and booking UI
- 🧾 Fill in passenger details and simulate payment
- ✅ Booking confirmation modal with delay and redirect
- 📑 View all your bookings on the "My Bookings" page
- ⏳ Auto logout after 5 minutes of inactivity

### 🛠️ Admin Panel

- ➕ Add new flights to the system
- 📋 View list of bookings made by users
- 🧮 Flight and booking management using LocalStorage

---

## 🧰 Tech Stack

| Technology                 | Use Case                                           |
| -------------------------- | -------------------------------------------------- |
| React (Vite)               | Frontend framework                                 |
| TailwindCSS                | Styling                                            |
| React Router               | Page routing                                       |
| Formik + Yup               | Form validation                                    |
| LocalStorage               | Data persistence                                   |
| UUID                       | Unique booking IDs                                 |
| Custom Hooks + Context API | State sharing (e.g. selected flight, user session) |

---

## 📂 Project Structure

```
src/
│
├── components/         # Shared components (modals, table, etc.)
├── context/            # Context API for selected flight and auth
├── layout/             # User and Admin layout components
├── pages/              # Page views (Home, Booking, Payment, etc.)
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── App.tsx             # Routing logic
```

---

## 🧪 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/ManSOorcode/Flight_Booking_App.git
cd flymate-booking-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

> Visit `http://localhost:5173` to use the app.

---

## 📝 Notes

- Admin can add flights via the Admin Panel UI.
- All flight and booking data is stored in `localStorage`, so a browser refresh does not lose state.
- Payment gateway is simulated (no real API calls).
- Session timeout will auto-logout the user after 5 minutes of inactivity.

---

## 📸 Screenshots

You can add screenshots of:

- User Home Page
- Booking Page UI
- Payment Modal
- Admin Dashboard
- My Bookings Page

---

## 📌 Future Enhancements (Ideas)

- Add IndexedDB support for more complex data persistence
- Implement real payment integration (e.g. Stripe)
- Enable authentication with JWT
- Add filters for flights (price, airline, layovers)
- Backend support using Express + MongoDB

---

## 👨‍💻 Author

> **[Mansoor Khan]** – Frontend Developer  
> [GitHub](https://github.com/ManSOorcode) | [LinkedIn](https://www.linkedin.com/in/mansoor-khan-890311116)
