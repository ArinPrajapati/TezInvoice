# TezInvoice

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
TezInvoice is a full-stack invoice management application designed to simplify the creation, tracking, and management of invoices for clients. It features a modern Next.js frontend with Tailwind CSS and a robust Express.js backend powered by TypeScript, MongoDB, and Docker for easy deployment.

## Features
- User authentication (login/signup)
- Client management (create, update, list)
- Invoice creation and management
- Real-time currency conversion based on exchange rates
- PDF invoice generation
- Dashboard with unpaid and paid invoice summaries
- Responsive design and modern UI components

## Tech Stack
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- Mailing: NodeMailer
- Containerization: Docker & Docker Compose

## Prerequisites
- Node.js (v16+)
- npm or yarn
- Docker & Docker Compose
- MongoDB instance (local or cloud)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ArinPrajapati/TezInvoice.git
   cd TezInvoice
   ```
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

## Environment Variables
### Server (.env)
```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-username>
SMTP_PASS=<smtp-password>
```  
### Client (
create a `.env.local` file at the root of `client/`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database
TezInvoice uses MongoDB to store users, clients, invoices, and exchange rates. Ensure your MongoDB URI is configured in `server/.env`.

## Running the Application
### Using Docker Compose
From the project root:
```bash
docker-compose up --build
```
This will start both the client (Next.js) and server (Express) services.

### Running Locally Without Docker
1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd ../client
   npm run dev
   ```
Frontend will run on `http://localhost:3000` and backend on `http://localhost:5000` by default.

## API Documentation
Base URL: `http://localhost:5000/api`

### Authentication
- **POST** `/auth/signup`  
  Register a new user.  
  Request body: `{ name, email, password }`  
  Response: `{ user, token }`

- **POST** `/auth/login`  
  Authenticate a user.  
  Request body: `{ email, password }`  
  Response: `{ user, token }`

### Clients
- **GET** `/clients`  
  List all clients for the authenticated user.
- **POST** `/clients`  
  Create a new client.  
  Body: `{ name, email, address, phone }`
- **PUT** `/clients/:clientId`  
  Update client details.
- **DELETE** `/clients/:clientId`  
  Remove a client.

### Invoices
- **GET** `/invoices`  
  List all invoices.
- **GET** `/invoices/:invoiceId`  
  Retrieve an invoice by ID.
- **POST** `/invoices`  
  Create a new invoice.  
  Body: `{ clientId, items: [{ description, quantity, price }], currency, dueDate }`
- **PUT** `/invoices/:invoiceId`  
  Update an existing invoice.
- **DELETE** `/invoices/:invoiceId`  
  Delete an invoice.
- **GET** `/invoices/:invoiceId/pdf`  
  Download invoice PDF.

### Exchange Rates
- **GET** `/exchangeRates/latest`  
  Fetch the latest exchange rates.

## Project Structure
```
TezInvoice/
├── client/           # Next.js frontend
│   ├── src/
│   ├── components/
│   └── ...
├── server/           # Express backend
│   ├── src/
│   ├── models/
│   ├── routes/
│   └── ...
├── docker-compose.yml
└── README.md         # ← You are here
```

## Contributing
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License
This project is licensed under the MIT License. See the [LICENSE](server/LICENSE.txt) file for details.
