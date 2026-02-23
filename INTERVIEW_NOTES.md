# TezInvoice - Deep Dive Technical Documentation
## Interview Preparation Guide

---

## 📋 Table of Contents
1. [Project Overview & Business Context](#1-project-overview--business-context)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack & Justifications](#3-technology-stack--justifications)
4. [Database Design](#4-database-design)
5. [Backend Architecture Deep Dive](#5-backend-architecture-deep-dive)
6. [Frontend Architecture Deep Dive](#6-frontend-architecture-deep-dive)
7. [Security Implementation](#7-security-implementation)
8. [Key Design Patterns Used](#8-key-design-patterns-used)
9. [Critical Features & Implementation Logic](#9-critical-features--implementation-logic)
10. [Scalability Considerations](#10-scalability-considerations)
11. [Trade-offs & Design Decisions](#11-trade-offs--design-decisions)
12. [Future Improvements & What I Would Change](#12-future-improvements--what-i-would-change)
13. [Common Interview Questions & Answers](#13-common-interview-questions--answers)

---

## 1. Project Overview & Business Context

### What is TezInvoice?
TezInvoice is a **full-stack invoice management SaaS application** designed for freelancers, small businesses, and service providers to:
- Create professional invoices
- Manage client information
- Track payment statuses (paid/unpaid)
- Send invoices via email with PDF attachments
- Handle multi-currency conversions automatically

### Problem Statement
Small businesses and freelancers often struggle with:
- Creating professional-looking invoices
- Tracking which clients have paid
- Managing multiple currencies for international clients
- Sending invoices efficiently

### Solution
TezInvoice provides an all-in-one platform that handles invoice creation, client management, and payment tracking with automatic currency conversion.

---

## 2. System Architecture

### High-Level Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Next.js Frontend (React + TypeScript)      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │    │
│  │  │ Zustand  │  │  Axios   │  │   UI Components      │   │    │
│  │  │  Store   │  │  Client  │  │  (shadcn/ui)         │   │    │
│  │  └──────────┘  └──────────┘  └──────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER TIER                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Express.js Backend (TypeScript)             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │    │
│  │  │   JWT    │  │Sanitize  │  │   Controllers        │   │    │
│  │  │Middleware│  │Middleware│  │  (Auth/Invoice/...)  │   │    │
│  │  └──────────┘  └──────────┘  └──────────────────────┘   │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │    │
│  │  │ PDF Gen  │  │Currency  │  │   NodeMailer         │   │    │
│  │  │(pdfmake) │  │Converter │  │   Email Service      │   │    │
│  │  └──────────┘  └──────────┘  └──────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA TIER                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      MongoDB                             │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────────┐  │    │
│  │  │ Users  │ │Clients │ │Invoices│ │ Exchange Rates   │  │    │
│  │  └────────┘ └────────┘ └────────┘ └──────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│  ┌──────────────────┐  ┌──────────────────────────────────┐    │
│  │  ExchangeRate    │  │         SMTP Server               │    │
│  │  API (v6)        │  │     (Gmail/NodeMailer)            │    │
│  └──────────────────┘  └──────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Pattern: **3-Tier Monolithic Architecture**

**Why Monolithic for MVP?**
- Faster development and deployment
- Simpler debugging and testing
- Lower operational complexity for a small team
- Can be refactored to microservices later if needed

---

## 3. Technology Stack & Justifications

### Frontend Stack

| Technology | Purpose | Why This Choice? |
|------------|---------|------------------|
| **Next.js 14** | React Framework | SSR capabilities, file-based routing, built-in API routes, production-ready |
| **TypeScript** | Type Safety | Catch errors at compile time, better IDE support, self-documenting code |
| **Tailwind CSS** | Styling | Utility-first, rapid prototyping, consistent design system, small bundle size |
| **shadcn/ui** | UI Components | Accessible, customizable, copy-paste components, no external dependencies |
| **Zustand** | State Management | Simpler than Redux, minimal boilerplate, TypeScript-first, no providers needed |
| **Axios** | HTTP Client | Request/response interceptors, automatic transforms, better error handling |

### Backend Stack

| Technology | Purpose | Why This Choice? |
|------------|---------|------------------|
| **Express.js** | Web Framework | Mature, minimal, extensive middleware ecosystem, flexible |
| **TypeScript** | Type Safety | Consistent with frontend, better maintainability |
| **MongoDB** | Database | Schema flexibility for invoice items, easy horizontal scaling, JSON-like documents |
| **Mongoose** | ODM | Schema validation, middleware hooks, TypeScript support |
| **JWT** | Authentication | Stateless, scalable, no server-side session storage needed |
| **pdfmake** | PDF Generation | Declarative document definitions, no external dependencies like Puppeteer |
| **NodeMailer** | Email Service | Widely used, supports multiple providers, attachments support |
| **node-cron** | Task Scheduling | Simple cron-like scheduling for exchange rate updates |

### Infrastructure

| Technology | Purpose | Why This Choice? |
|------------|---------|------------------|
| **Docker** | Containerization | Consistent dev/prod environments, easy deployment |
| **Docker Compose** | Multi-container | Local development orchestration |

---

## 4. Database Design

### Entity-Relationship Overview

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Client      │
├─────────────────┤       ├─────────────────┤
│ _id (ObjectId)  │◄──────│ userId (ref)    │
│ name            │       │ _id             │
│ email           │       │ name            │
│ password (hash) │       │ email           │
│ serviceName     │       │ currency        │
│ role            │       │ phoneNumber     │
│ isVerified      │       │ invoices[]      │
│ accountLevel    │       └─────────────────┘
│ currency        │              │
│ invoicesLimit   │              │
└─────────────────┘              │
        │                        │
        │                        ▼
        │              ┌─────────────────┐
        └──────────────│    Invoice      │
                       ├─────────────────┤
                       │ _id             │
                       │ userId (ref)    │
                       │ invoiceNumber   │
                       │ clientInfo{}    │
                       │ items[]         │
                       │ clientItems[]   │
                       │ totalAmount     │
                       │ client_total    │
                       │ currency        │
                       │ status          │
                       │ dueDate         │
                       └─────────────────┘

┌─────────────────┐
│  ExchangeRate   │
├─────────────────┤
│ _id (currency)  │  ← Uses currency code as _id (e.g., "EUR", "GBP")
│ rate            │
│ updatedAt       │
└─────────────────┘
```

### Schema Design Decisions

#### 1. **User Schema**
```typescript
{
  name: String,
  serviceName: String,      // Business/Company name for invoices
  email: String,
  password: String,         // Bcrypt hashed
  role: ["user", "admin"],
  isVerified: Boolean,      // Email verification status
  accountLevel: ["Free", "Professional", "Unlimited"],  // Tiered pricing
  currency: String,         // User's preferred currency
  invoicesLimit: Number     // Based on account level
}
```

**Design Decisions:**
- `serviceName` separate from `name` allows personalization
- `invoicesLimit` enables freemium business model
- `isVerified` gates certain features (sending invoices)

#### 2. **Invoice Schema - Dual Currency Storage**
```typescript
{
  items: [...],           // Original items in user's currency
  clientItems: [...],     // Converted items in client's currency
  totalAmount: Number,    // Total in user's currency
  client_total: Number,   // Total in client's currency
  currency: String,       // User's invoice currency
  clientInfo: {
    currency: String      // Client's preferred currency
  }
}
```

**Why Dual Storage?**
- **Problem**: Multi-currency invoicing where user bills in USD but client pays in EUR
- **Solution**: Store both original and converted amounts
- **Benefit**: User sees their revenue in their currency; client sees their bill in their currency
- **Trade-off**: Some data duplication, but ensures historical accuracy even if exchange rates change

#### 3. **ExchangeRate Schema - ID Optimization**
```typescript
{
  _id: String,    // Currency code (EUR, GBP, INR)
  rate: Number,   // Rate against USD
  updatedAt: Date
}
```

**Why Currency as _id?**
- Eliminates need for additional index
- O(1) lookups by currency code
- Natural unique constraint

---

## 5. Backend Architecture Deep Dive

### Directory Structure Philosophy

```
server/src/
├── index.ts              # Entry point, middleware setup
├── config/               # External service configs
│   ├── connectDb.ts      # MongoDB connection
│   └── nodeMailler.ts    # Email transporter
├── controller/           # Business logic
│   ├── auth.ts           # Authentication operations
│   ├── invoices.ts       # Invoice CRUD + PDF/Email
│   ├── clients.ts        # Client management
│   └── exchangeRates.ts  # Rate fetching/caching
├── helper/               # Utility functions
│   ├── currencyConverter.ts  # Singleton converter with caching
│   ├── invoiceTemplates.ts   # PDF template variations
│   ├── emailtemplate.ts      # HTML email templates
│   └── error.ts              # Standardized error responses
├── middleware/           # Request processing
│   ├── jwt.ts            # Authentication middleware
│   └── sanitize.ts       # XSS protection
├── models/               # Mongoose schemas
├── routes/               # Route definitions
└── types/                # TypeScript interfaces
```

### Request Flow

```
Request → CORS → JSON Parser → Sanitize → Route → JWT Verify → Controller → Response
```

### Key Backend Patterns

#### Pattern 1: Middleware Chain
```typescript
// server/src/index.ts
app.use(express.json());        // 1. Parse JSON body
app.use(sanitizeMiddleware);    // 2. Sanitize inputs
app.use(cors(corsOptions));     // 3. Handle CORS
app.use("/api", routes);        // 4. Route to handlers
```

**Why this order?**
- Parse before sanitize (need body content)
- Sanitize before routes (prevent XSS in any route)
- CORS handled globally

#### Pattern 2: Controller Error Handling
```typescript
// Consistent error response pattern
try {
  // Business logic
} catch (error) {
  _500("Operation Failed", error.message, res);
}
```

#### Pattern 3: JWT Payload Injection
```typescript
// Middleware adds user data to request
req.data = decoded;  // Contains { id: userId }

// Controller accesses it
const { id } = req.data as jwt.JwtPayload;
```

---

## 6. Frontend Architecture Deep Dive

### Directory Structure Philosophy

```
client/src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── dashboard/          # Protected dashboard
│   ├── create/invoice/     # Invoice creation wizard
│   ├── invoice/[id]/       # Dynamic invoice view
│   ├── login/              # Authentication
│   └── signup/
├── axios/                  # API layer
│   ├── api.ts              # Axios singleton with interceptors
│   └── service/            # Domain-specific services
│       ├── authService.ts
│       ├── invoiceService.ts
│       └── clientService.ts
├── components/             # React components
│   ├── DashBoard/          # Dashboard-specific
│   ├── home/               # Landing page sections
│   ├── nav/                # Navigation components
│   ├── root/               # App wrapper (auth logic)
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── store/                  # Zustand state management
└── types/                  # TypeScript interfaces
```

### State Management with Zustand

```typescript
// store/store.ts - Simple, flat state
const useStore = create<Store>()((set) => ({
  login: false,
  loginData: { ... },
  publicRoute: false,
  path: "",
  setLogin: (login) => set({ login }),
  setLoginData: (loginData) => set({ loginData }),
}));
```

**Why Zustand over Redux?**
- No boilerplate (no actions, reducers, providers)
- Direct state mutations with `set()`
- Built-in TypeScript support
- Smaller bundle size
- Easier to understand and maintain

### API Client Architecture

```typescript
// axios/api.ts - Singleton pattern with interceptors
class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = this.initializeAxios();
    this.setupInterceptors(this.client);
  }
  
  // Request interceptor - adds auth token
  request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  
  // Response interceptor - retry logic + token refresh
  response.use(
    (response) => response,
    async (error) => {
      // Retry on network error (exponential backoff)
      // Auto-refresh token on 401
    }
  );
}
```

**Key Features:**
1. **Automatic token injection** - No manual header management
2. **Retry with exponential backoff** - Handles network flakiness
3. **Token refresh flow** - Seamless re-authentication
4. **Centralized error handling** - Consistent error format

### Route Protection Pattern

```typescript
// components/root/Root.tsx
const PUBLIC_ROUTES = ["/login", "/signup", "/"];

useEffect(() => {
  // Redirect logged-in users away from login/signup
  if (authToken && isPublicRoute(pathname)) {
    router.push("/dashboard");
  }
  
  // Redirect non-authenticated users to login
  if (!authToken && !isPublicRoute(pathname)) {
    router.push("/login");
  }
}, []);
```

---

## 7. Security Implementation

### 1. Password Security
```typescript
// Bcrypt with salt rounds
const hashPassword = await bcrypt.hash(password, 10);

// Comparison (timing-safe)
const isMatch = await bcrypt.compare(password, user.password);
```
**Why 10 rounds?** Balance between security and performance (~100ms hash time)

### 2. JWT Implementation
```typescript
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```

**Security Considerations:**
- Short-lived tokens (7 days) - limits exposure
- Payload contains only user ID - minimal data exposure
- Secret from environment variable - not hardcoded

### 3. Input Sanitization (XSS Prevention)
```typescript
// middleware/sanitize.ts
function sanitizeInput(input: string): string {
  return input.replace(/[&<>"']/g, (match) => {
    const sanitizeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return sanitizeMap[match];
  });
}
```

**Applied to:**
- Query parameters
- URL parameters
- Request body strings

### 4. CORS Configuration
```typescript
const corsOptions = {
  origin: "*",  // In production, should be specific domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

### 5. Authorization Checks
```typescript
// Every invoice operation verifies ownership
if (invoice.userId.toString() !== id) {
  res.status(401).json({ message: "Unauthorized" });
  return;
}
```

---

## 8. Key Design Patterns Used

### 1. Singleton Pattern (Currency Converter)
```typescript
class CurrencyConverter {
  private static instance: CurrencyConverter;
  private cache: ExchangeRateCache = {};
  
  private constructor() {} // Private constructor
  
  public static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }
}
```

**Why Singleton?**
- Single source of truth for exchange rates
- Shared cache across all requests
- Prevents redundant database queries

### 2. Factory Pattern (Invoice Templates)
```typescript
class InvoiceMaker {
  getCombination(header, clientInfo, table, footer) {
    // Dynamically compose PDF from template parts
    return {
      content: [
        this[`headerType${header}`](),
        this[`clientInfoType${clientInfo}`](),
        this[`tableType${table}`](),
        this[`footerType${footer}`](),
      ]
    };
  }
}
```

**Why Factory?**
- Multiple template variations without duplicating code
- Easy to add new template styles
- Allows user customization in future

### 3. Service Layer Pattern (Frontend)
```typescript
// Separate service classes for each domain
class InvoiceService {
  static async createInvoice(invoice) { ... }
  static async getAllInvoices(params) { ... }
  static async sendInvoice(id) { ... }
}
```

**Why Services?**
- Decouples API calls from components
- Centralized error handling
- Easier testing and mocking

### 4. Repository Pattern (Mongoose Models)
```typescript
// Models abstract database operations
const invoice = await invoices.create({ ... });
const result = await invoices.findOne({ _id: id });
await invoices.findByIdAndDelete(id);
```

---

## 9. Critical Features & Implementation Logic

### Feature 1: Multi-Currency Invoice System

**Business Requirement:**
- User creates invoice in their currency (e.g., USD)
- Client receives invoice in their preferred currency (e.g., EUR)

**Implementation:**
```typescript
// 1. Fetch exchange rates daily via cron
corn.schedule('0 0 * * *', async () => updateExchangeRates());

// 2. Store rates with currency as document ID
await ExchangeRate.updateOne(
  { _id: currency },
  { rate: rate, updatedAt: lastUpdated },
  { upsert: true }
);

// 3. Convert on invoice creation
const client_total = await convertCurrency(
  totalAmount,
  currency,           // User's currency
  clientInfo.currency // Client's currency
);

// 4. Store both versions
const invoice = await invoices.create({
  items: items,           // Original
  clientItems: clientItems, // Converted
  totalAmount: totalAmount,
  client_total: client_total,
});
```

**Caching Strategy:**
- 10-hour cache duration (rates update daily)
- Cache invalidation on miss or expiry
- Batch refresh when multiple currencies needed

### Feature 2: PDF Invoice Generation

**Technology:** pdfmake (declarative PDF generation)

**Why pdfmake over alternatives?**
| Option | Pros | Cons |
|--------|------|------|
| **pdfmake** ✓ | No browser/Puppeteer, declarative, small | Limited styling |
| Puppeteer | Full HTML/CSS | Heavy, memory-intensive |
| PDFKit | Low-level control | More complex API |

**Template System:**
```typescript
class InvoiceMaker {
  headerType1() { ... }   // Company name style
  headerType2() { ... }   // "INVOICE" title style
  headerType3() { ... }   // Split header style
  
  // Mix and match any combination
  getCombination(1, 2, 1, 1)  // Header1 + ClientInfo2 + Table1 + Footer1
}
```

### Feature 3: Email Delivery with Attachments

**Flow:**
1. Generate PDF → Save to `/public/pdf/`
2. Compose HTML email using template
3. Attach PDF file
4. Send via NodeMailer
5. Delete PDF file (cleanup)

```typescript
await sendEmail({
  from: "hello@demomailtrap.com",
  to: clientEmail,
  subject: "Invoice",
  html: invoiceTemplate(...),
  attachments: [{
    filename: "invoice.pdf",
    path: filePath,
    encoding: "base64",
    contentType: "application/pdf",
  }],
});
fs.unlinkSync(filePath);  // Cleanup
```

### Feature 4: Magic Link Authentication

**Implementation:**
```typescript
// Generate encrypted token with timestamp
const token = {
  token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
  time: Date.now(),
};

const encryptedToken = cryptr.encrypt(JSON.stringify(token));
const link = `${CLIENT_URL}/auth/login/${encryptedToken}`;

// Send via email
await sendEmail({
  to: email,
  html: magicLinkTemplate(link),
});
```

**Why Encryption + JWT?**
- JWT alone is decodable (base64)
- Encryption adds security layer
- Timestamp can prevent link reuse

---

## 10. Scalability Considerations

### Current State (MVP)
- Single server deployment
- MongoDB single instance
- In-memory caching (per-process)

### Scaling Path

#### Horizontal Scaling Challenges & Solutions

| Challenge | Current State | Scaling Solution |
|-----------|--------------|------------------|
| **Session State** | JWT (stateless) ✓ | Already scalable |
| **Exchange Rate Cache** | In-memory (per-process) | Redis shared cache |
| **PDF Generation** | Sync, blocks request | Queue-based (Bull/Redis) |
| **Email Sending** | Sync | Async queue |
| **File Storage** | Local filesystem | S3/Cloud Storage |

#### Database Scaling
```
Current: Single MongoDB
    ↓
Phase 1: MongoDB Replica Set (High Availability)
    ↓
Phase 2: Sharding by userId (Horizontal Scale)
```

#### Recommended Sharding Key: `userId`
- Invoices always queried by userId
- Even distribution across shards
- Locality of related data

---

## 11. Trade-offs & Design Decisions

### Decision 1: MongoDB vs PostgreSQL

**Chose MongoDB because:**
- Invoice items are variable-length arrays (no need for join table)
- Schema flexibility during MVP
- JSON-like documents match API responses
- Easy embedded documents for clientInfo

**Trade-off:**
- No ACID transactions across documents (mitigated by embedding)
- No enforced referential integrity

### Decision 2: Storing Converted Currency Amounts

**Option A:** Convert on-the-fly when displaying
**Option B:** Store pre-converted amounts ✓ (Chosen)

**Why Option B:**
- Exchange rates change; historical invoices should reflect original conversion
- Faster reads (no conversion needed)
- Trade-off: Data duplication (~2x item storage)

### Decision 3: Zustand vs Redux

**Chose Zustand:**
- Simpler learning curve
- Less boilerplate
- Direct state mutations
- Trade-off: Less structured for large teams

### Decision 4: Server-side PDF Generation

**Alternative:** Client-side generation (jsPDF, html2canvas)

**Chose Server-side because:**
- Consistent output regardless of browser
- Server has direct data access
- Can send email with attachment in one flow
- Trade-off: Server CPU usage for PDF generation

### Decision 5: REST API vs GraphQL

**Chose REST because:**
- Simpler implementation for CRUD operations
- Caching at HTTP level (GET requests)
- Well-understood patterns
- Trade-off: Multiple endpoints vs single endpoint

---

## 12. Future Improvements & What I Would Change

### Technical Debt

1. **Error Handling Consistency**
   - Currently: Mix of error patterns
   - Improvement: Standardized error middleware

2. **Input Validation**
   - Currently: Manual validation in controllers
   - Improvement: Joi/Zod schema validation middleware

3. **Testing**
   - Currently: No tests
   - Improvement: Jest unit tests, Supertest integration tests

4. **Environment Configuration**
   - Currently: Hardcoded values in some places
   - Improvement: Centralized config with validation

### Architecture Improvements

1. **Rate Limiting**
   ```typescript
   // Add express-rate-limit
   app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 100 }));
   ```

2. **Request Logging**
   ```typescript
   // Add morgan or winston
   app.use(morgan('combined'));
   ```

3. **API Versioning**
   ```typescript
   app.use('/api/v1', routes);  // Future-proof API
   ```

4. **Separate PDF Service**
   - Move PDF generation to worker process
   - Use message queue for async processing

### Feature Improvements

1. **Recurring Invoices** - Auto-generate monthly invoices
2. **Payment Integration** - Stripe/PayPal webhooks
3. **Dashboard Analytics** - Revenue charts, payment trends
4. **Multi-user Teams** - Role-based access control

---

## 13. Common Interview Questions & Answers

### Q1: "Walk me through the architecture of your project"

**Answer Framework:**
> "TezInvoice is a 3-tier monolithic application. The frontend is built with Next.js and TypeScript, using Zustand for state management and Tailwind for styling. The backend is Express.js with MongoDB as the database.
> 
> The key architectural decisions were:
> 1. REST API for simplicity and HTTP caching
> 2. JWT for stateless authentication that scales horizontally
> 3. MongoDB for flexible invoice schemas with embedded documents
> 4. Service layer pattern on frontend to decouple API calls from components"

### Q2: "How does your authentication work?"

**Answer:**
> "I implemented JWT-based authentication. On login, the server validates credentials with bcrypt and returns a signed JWT with a 7-day expiry. The token contains only the user ID to minimize exposure.
> 
> On the frontend, an Axios interceptor automatically attaches the token to every request. Another interceptor handles 401 responses by attempting token refresh or redirecting to login.
> 
> I also implemented magic link authentication as a passwordless option, using encrypted tokens sent via email."

### Q3: "How do you handle multi-currency?"

**Answer:**
> "This was one of the more interesting challenges. I built a currency conversion system with three components:
> 
> 1. **Data Source**: A cron job fetches exchange rates from ExchangeRate-API daily
> 2. **Caching**: A Singleton CurrencyConverter class maintains an in-memory cache with 10-hour TTL to minimize database queries
> 3. **Storage Strategy**: I store both original and converted amounts in invoices, so historical invoices maintain their conversion rate even as rates change"

### Q4: "What would you do differently if starting over?"

**Answer:**
> "A few things:
> 
> 1. **Add validation middleware** - I'd use Zod or Joi from the start for request validation instead of manual checks in controllers
> 
> 2. **Set up testing early** - No tests currently, which makes refactoring risky
> 
> 3. **Use a job queue for PDF/email** - Currently synchronous, which could timeout for large invoices
> 
> 4. **Consider event-driven architecture** - Actions like 'invoice created' could trigger email, analytics, and notifications independently"

### Q5: "How would you scale this for 100x users?"

**Answer:**
> "The current architecture has some scalability built-in:
> - JWT is stateless, so multiple servers work without session sharing
> - MongoDB can be sharded by userId
> 
> What I'd change:
> 1. **Move cache to Redis** - Shared across instances
> 2. **PDF generation to workers** - Message queue (Bull + Redis) to offload CPU-intensive work
> 3. **CDN for static assets** - S3 + CloudFront for PDF storage
> 4. **Database optimization** - Indexes on frequently queried fields (userId, status, date)"

### Q6: "How do you handle security?"

**Answer:**
> "Multiple layers:
> 
> 1. **Input Sanitization**: Custom middleware escapes XSS characters
> 2. **Password Security**: Bcrypt with 10 salt rounds
> 3. **Authentication**: JWT with short expiry
> 4. **Authorization**: Every endpoint verifies resource ownership
> 5. **CORS**: Configured to restrict origins (needs tightening for production)
> 
> What I'd add: Rate limiting, HTTPS enforcement, security headers (helmet.js), and input validation schemas"

### Q7: "Why did you choose MongoDB over a relational database?"

**Answer:**
> "Two main reasons:
> 
> 1. **Invoice items are variable** - Invoices can have 1-100 line items. In SQL, this would require a separate table and JOINs. In MongoDB, items are an embedded array, making reads faster and atomic.
> 
> 2. **Schema flexibility** - During development, invoice fields evolved. MongoDB let me iterate quickly without migrations.
> 
> Trade-off: I lose referential integrity and ACID transactions across collections, but for this use case, embedding documents mitigates those concerns."

---

## Quick Reference Cheatsheet

### Tech Stack Summary
```
Frontend: Next.js + TypeScript + Tailwind + Zustand + shadcn/ui
Backend:  Express.js + TypeScript + MongoDB + Mongoose
Auth:     JWT + Bcrypt + Magic Links
Email:    NodeMailer
PDF:      pdfmake
Currency: ExchangeRate-API + Singleton Converter
DevOps:   Docker + Docker Compose
```

### Key Files to Reference
```
Backend Entry:     server/src/index.ts
Auth Controller:   server/src/controller/auth.ts
Invoice Logic:     server/src/controller/invoices.ts
Currency Convert:  server/src/helper/currecyConverter.ts
PDF Templates:     server/src/helper/invoiceTemplates.ts

Frontend Entry:    client/src/app/layout.tsx
API Client:        client/src/axios/api.ts
State Store:       client/src/store/store.ts
Dashboard:         client/src/components/DashBoard/Main.tsx
Route Protection:  client/src/components/root/Root.tsx
```

### Design Patterns Used
1. Singleton (CurrencyConverter)
2. Factory (InvoiceTemplates)
3. Service Layer (InvoiceService, AuthService)
4. Middleware Chain (Express)
5. Interceptor (Axios)

---

**Good luck with your interview! 🎯**
