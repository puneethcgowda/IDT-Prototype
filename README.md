# 🌱 AgriConnect

> A prototype web application built around the topic **Agriculture as Livelihood**, addressing the problem statement: **small land holdings and challenges in increasing productivity.**

AgriConnect is a digital cooperative that connects small farmers directly with consumers, lets farmers rent agricultural equipment online, and gives them market intelligence and government scheme information — all in one place.

---

## ✨ Features

| # | Feature | Where |
|---|---|---|
| 1 | Direct **farmer ↔ consumer** marketplace | `/marketplace` |
| 2 | **Online equipment rental** with date booking | `/equipment` |
| 3 | **Crops & live market prices** with best-practice tips | `/crops` |
| 4 | **Government schemes** (PM-KISAN, PMFBY, KCC, PMKSY, e-NAM, AIF, Soil Health) | `/schemes` |
| 5 | **Two user roles** (Farmer & Consumer) with profiles — contact info, location and interests | `/signup`, `/profile` |
| 6 | **Role-aware dashboards** — current listings, upcoming bookings, order history, saved items | `/dashboard` |
| 7 | **Secure simulated payment gateway** — Card / UPI / Net Banking | Buy/Book flows |
| 8 | **Advanced search & filters** — text, category/crop, location, price range, availability, sort | `/marketplace`, `/equipment` |
| 9 | **Reviews & ratings** for products, equipment and users | Product/Equipment/Profile pages |
| 10 | **Direct messaging** between farmers and consumers | `/messages` |
| 11 | **Interactive 8-step onboarding tour** on first login | Auto-launches |

---

## 🛠 Tech stack

- **React 18** + **TypeScript**
- **Vite** (dev server / build)
- **Tailwind CSS** (utility-first styling)
- **React Router v6**
- **lucide-react** icons
- **localStorage** as the prototype data layer (no backend needed to demo)

---

## 🚀 Quick start

```bash
# install dependencies
npm install

# run the dev server (http://localhost:5173)
npm run dev

# create a production build
npm run build

# preview the production build
npm run preview
```

Requirements: Node.js 18+ (sandbox uses v22).

---

## 👤 Demo accounts

The app seeds itself with sample data on first load. Two ready-to-use accounts:

| Role | Email | Password |
|---|---|---|
| Farmer (Ramesh Patel · Anand, Gujarat) | `ramesh@farm.in` | `demo1234` |
| Consumer (Anita Sharma · Mumbai)        | `anita@buyer.in`  | `demo1234` |

You can also create your own farmer or consumer account from `/signup` — the onboarding tour will launch automatically the first time you sign in.

To reset all demo data, open the browser DevTools console and run:
```js
localStorage.clear(); location.reload();
```

---

## 📁 Project structure

```
src/
├── App.tsx                  # Routing + protected routes + onboarding mount
├── main.tsx                 # React entrypoint with providers
├── index.css                # Tailwind + small custom utilities
├── components/
│   ├── Navbar.tsx           # Auth-aware top nav with mobile menu + unread badge
│   ├── Footer.tsx
│   ├── StarRating.tsx       # Reusable interactive/read-only star rating
│   ├── PaymentModal.tsx     # Simulated Card / UPI / Net Banking checkout
│   ├── NewListingModal.tsx  # Farmer creates a new produce listing
│   ├── NewEquipmentModal.tsx# Farmer lists equipment for rent
│   └── OnboardingTour.tsx   # 8-step role-aware first-login tour
├── context/
│   ├── AuthContext.tsx      # Signup / login / profile / onboarding state
│   └── DataContext.tsx      # Listings / equipment / orders / bookings / reviews / messages / saved
├── data/mockData.ts         # Seed users, listings, equipment, crops, schemes, reviews
├── pages/
│   ├── Home.tsx             # Hero, problem statement, features, market prices strip
│   ├── About.tsx            # Project topic, problem statement, tech stack
│   ├── Login.tsx            # Login + demo-account quick-fill
│   ├── Signup.tsx           # 2-step: role → contact + interests
│   ├── Marketplace.tsx      # Filterable produce grid
│   ├── ProductDetail.tsx    # Buy flow (qty + payment) + reviews
│   ├── Equipment.tsx        # Filterable equipment grid
│   ├── EquipmentDetail.tsx  # Date-range booking + payment + reviews
│   ├── Crops.tsx            # Crops with prices + season filter + best-practices modal
│   ├── Schemes.tsx          # Govt. scheme cards with categories + external links
│   ├── Dashboard.tsx        # Role-aware tabs: listings, bookings, orders, saved
│   ├── Profile.tsx          # View/edit profile + listings + reviews
│   └── Messages.tsx         # Threaded chat with sidebar and unread tracking
├── types/index.ts           # All shared TypeScript models
└── utils/storage.ts         # localStorage abstraction with seed initialisation
```

---

## 🔍 Notes on the prototype

- **Payments are simulated.** The `PaymentModal` mimics a real checkout (Card / UPI / Net Banking) but no real money is processed.
- **Data is local.** All listings, orders, bookings, messages and reviews live in your browser via `localStorage`. Different browsers / devices will see independent data sets.
- **Government scheme links** point to the *real* official portals (pmkisan.gov.in, pmfby.gov.in, etc.) — confirm latest details on the official sites.

---

## 📚 About the project

| | |
|---|---|
| **Topic** | Agriculture as Livelihood |
| **Problem statement** | Small land holdings and challenges in increasing productivity |
| **Goal** | Empower small landholders by enabling direct sales, on-demand equipment access, market intelligence and easy access to government support |

---

## License

This is a student project prototype.
