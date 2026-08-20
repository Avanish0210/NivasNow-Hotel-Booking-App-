# NivasNow

<div align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-4.0.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</div>

NivasNow is a modern Airbnb-inspired hotel booking platform that combines a premium visual experience with a robust full-stack backend. The project includes a Spring Boot API for hotel and booking management, a reactive React frontend for browsing and booking stays, and secure authentication with JWT and OAuth support.

## Overview

This application is designed to simulate a real-world travel booking experience with:

- Hotel discovery and search by city/date/room count
- Room-level booking and guest management
- Secure authentication and authorization flows
- Hotel manager admin tools for managing properties and rooms
- Payment initiation using Stripe
- A premium design with immersive 3D visuals

## Tech Stack

### Backend
- Java 21
- Spring Boot 4.0.1
- Spring Web MVC
- Spring Data JPA
- Spring Security
- JWT authentication with refresh-token flow
- OAuth2 login integration with Google
- PostgreSQL database
- ModelMapper for DTO mapping
- Stripe Java SDK
- Lombok

### Frontend
- React 19
- Vite
- React Router DOM
- Axios for API calls
- React Icons
- React Three Fiber + Three.js for 3D experiences
- Custom CSS with glassmorphism and premium booking UI

### Tools and Dev Setup
- Maven wrapper for backend builds
- ESLint for frontend quality checks
- PostgreSQL local development database

## Application Features

### Customer Experience
- Search hotels by destination, dates, and room count
- Browse real estate-style hotel cards with pricing and amenities
- Open hotel detail pages with gallery, location, amenities, and contact details
- Explore room categories with 3D previews
- Book stays in a multi-step flow:
  - Select check-in/check-out dates
  - Add guest details
  - Continue to payment
- Secure login and signup with JWT-based authentication
- Refresh-token handling with cookie-based storage
- Google OAuth login support

### Admin Features
- Hotel dashboard for hotel managers
- Add new hotels and manage hotel metadata
- Activate/deactivate hotel listings
- Manage room inventory and room capacity
- View bookings associated with each hotel
- Role-based access via Spring Security

### Payment & Booking System
- Booking initialization API for hotels and rooms
- Guest collection for each booking
- Stripe checkout session generation
- Booking cancellation support
- Payment webhook-ready backend infrastructure

### Visual Experience
- Premium landing page with hero section and destination cards
- 3D animated hero scene and room previews
- Dark luxury aesthetic with gradients and glassmorphism
- Responsive layout across desktop and smaller screens

## Project Structure

```text
AirBnbClone/
├── frontend/                  # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── main/
│   │   ├── java/              # Spring Boot backend
│   │   └── resources/         # application config and static assets
│   └── test/
├── pom.xml                   # Maven project config
├── mvnw                      # Maven wrapper
├── README.md
└── HELP.md
```

## Core Backend API Areas

The backend exposes REST APIs under the `/api/v1` context path, including:

- `/auth/signup` — user registration
- `/auth/login` — login and token issuance
- `/auth/refresh` — access-token refresh
- `/hotels/search` — hotel search
- `/hotels/{hotelId}/info` — hotel details
- `/bookings/init` — booking creation
- `/bookings/{bookingId}/addGuests` — guest details
- `/bookings/{bookingId}/payments` — payment session creation
- `/admin/hotels` — hotel management for managers
- `/admin/hotels/{hotelId}/rooms` — room management

## Security Model

The application uses Spring Security with:

- JWT authentication for API access
- Stateless session management
- Role-based route protection
- Guest/public endpoints for browsing and auth pages
- Protected booking endpoints for authenticated users
- Hotel manager access restrictions for admin routes
- OAuth2 success handling for social login

## Prerequisites

Before running this project, make sure you have:

- Java 21+
- Maven or Maven wrapper
- Node.js 18+
- npm
- PostgreSQL installed and running

## Local Setup

### 1. Backend

Create a PostgreSQL database named `AirBnbDB` and update your credentials if needed in `src/main/resources/application.properties`.

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/AirBnbDB
spring.datasource.username=postgres
spring.datasource.password=your_password
```

Set the required environment variables:

```bash
export STRIPE_SECRET_KEY=your_stripe_secret_key
export CLIENT_ID=your_google_oauth_client_id
export SECRET_KEY=your_google_oauth_client_secret
```

Then run:

```bash
./mvnw spring-boot:run
```

The backend will serve API requests under:

```text
http://localhost:8080/api/v1
```

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Default Development Flow

- Open the frontend in the browser at `http://localhost:5173`
- Use the travel experience to browse hotels and search stays
- Sign up or log in for booking access
- For admin functionality, log in as a user with the `HOTEL_MANAGER` role and access the dashboard

## Notes

This project is structured as a polished full-stack demo and can be expanded with:

- real payment confirmations
- image uploads for hotels and rooms
- review and rating systems
- email notifications
- advanced filtering and availability logic
- deployment to cloud infrastructure

## License

This project is intended for learning and portfolio/demo purposes.

## Contributing

Feel free to fork the project, improve the design, add features, or adapt it for production use.

---

Built with Java, Spring Boot, React, and a premium hospitality booking experience in mind.

