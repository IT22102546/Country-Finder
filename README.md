[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)


# 🌍 Country Finder App

A modern React + Redux app to explore countries using the [REST Countries API](https://restcountries.com/). Features include country listing, filtering by region, searching by name, managing favorites, and user authentication via Firebase.

---

## 🧰 Tech Stack

* **React 18**
* **Redux Toolkit**
* **React Router v6**
* **Tailwind CSS**
* **Jest & React Testing Library**
* **Firebase**
* **Mapbox GL**
* **Flowbite UI**

---

## 📁 Project Structure

```
src/
├── redux/
│   ├── country/
│   │   ├── countriesSlice.js
│   │   └── countriesSlice.test.js
│   └── user/
│       ├── userSlice.js
│       └── userSlice.test.js
├── Pages/
│   └── test/
│       └── Countries.test.jsx
```

---

## ✨ Getting Started

### 🔧 Install Dependencies

```bash
npm install
```

### ▶️ Run Development Server

```bash
npm run dev
```

### 🏗️ Build for Production

```bash
npm run build
```

### 🔍 Preview Production Build

```bash
npm run preview
```

---

## ✅ Running Tests

> This project uses Jest with support for `--experimental-vm-modules` to support ES Modules in Vite + Jest setup.

### Run All Tests

```bash
npm run test
```

### Run Redux Slice Tests

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose src/redux/user/userSlice.test.js src/redux/country/countriesSlice.test.js
```

### Run Countries Component Test

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose src/Pages/test/Countries.test.jsx
```

---

## 🔐 Firebase Setup

To enable user authentication, follow these steps:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Email/Password Authentication** in the Authentication tab.
3. Get your Firebase config object and create a `.env` file in your root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Import and initialize Firebase in your app.

---

## 📦 Features

### 🌐 Country Explorer

* Fetch all countries
* Search by country name
* Filter by region
* View detailed country info
* Mark countries as favorite
* Remove countries from favorite

### 👤 User Management

* Sign in / Sign out


### 🧪 Test Coverage

* Slice reducers and async thunks
* UI components tested using React Testing Library



