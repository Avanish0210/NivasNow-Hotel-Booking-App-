# NivasNow - Premium Airbnb Clone

NivasNow is a fully integrated hotel booking platform featuring a powerful Spring Boot backend and an immersive, premium React frontend with 3D animations using Three.js and React Three Fiber.

## 🌟 Features
- **Immersive 3D Experience**: 3D home scenes, animated floating house, glowing spheres, particles, and 3D miniature room viewers.
- **Modern UI**: Polished glassmorphism design with a tailored dark theme and vibrant gradients.
- **Robust API**: Built securely with Spring Boot, Spring Security (JWT + OAuth), PostgreSQL, and Stripe integration.
- **Full Booking Flow**: User authentication, hotel browsing, date selection, guest management, and payment checkout.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Java 17+** (Project uses Java 21)
- **Node.js (v18+)** and **npm**
- **PostgreSQL** running locally on port `5432`
- **Maven** (optional, as the project includes the Maven wrapper `mvnw`)

---

## 🚀 Step 1: Backend Setup (Spring Boot)

1. **Database Configuration**:
   Ensure you have a local PostgreSQL instance running and create a database named `AirBnbDB`.
   Update `src/main/resources/application.properties` if your PostgreSQL username/password differ:
   ```properties
   spring.datasource.username=postgres
   spring.datasource.password=avanish7080
   ```

2. **Environment Variables**:
   The backend requires a few environment variables for Stripe and OAuth. Set them in your environment (or let Spring Boot pick them up):
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `CLIENT_ID`: Your Google OAuth Client ID
   - `SECRET_KEY`: Your Google OAuth Client Secret

3. **Start the Backend**:
   Open a terminal in the root directory `C:\Users\LENOVO\OneDrive\Documents\Projects\AirBNB Clone\AirBnbClone` and run:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend server will start on `http://localhost:8080/api/v1`.*

---

## 🎨 Step 2: Frontend Setup (React + Vite + 3D)

1. **Install Dependencies**:
   Open a **new** terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   *The Vite frontend server will start on `http://localhost:5173`.*

---

## 🌐 Step 3: Accessing the Application

- **Frontend Application**: Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.
- **Admin Access**: Sign up as a new user, change their role to `HOTEL_MANAGER` in your database, and access the Dashboard from your User Profile menu to add Hotels and Rooms.

---

## 🏗️ Architecture Stack
- **Backend**: Java 21, Spring Boot 4.0.1, Spring Data JPA, Spring Security, JWT, PostgreSQL, Stripe SDK.
- **Frontend**: React 18, Vite, React Router DOM, Axios, Three.js, React Three Fiber, React Icons.
