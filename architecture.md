# FlipQuiz - Backend Architecture

## Overview
FlipQuiz is a modern web application designed for creating and managing quiz decks using interactive flashcards. 
The backend architecture follows a highly decoupled, layered structure ensuring scalability, security, maintainability, and clean separation of concerns.

---

## Technical Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose Object Data Modeling (ODM)
- **Data Validation:** Zod
- **Testing Suite:** Jest

---

## Directory Structure & Data Flow Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: THE ROUTING GATE                       │
│                     (Files: backend/routes/*)                          │
├────────────────────────────────────────────────────────────────────────┤
│  • Defines declarative application endpoints (GET, POST, PUT, DELETE). │
│  • Acts as the primary entry interface for all incoming client traffic.│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
            MIDDLEWARE CHECKPOINT: SECURITY & DATA SANITATION
          (Files: backend/middleware/* & backend/validations/*)
          ├──────────────────────────────────────────────────────┤
          │  1. 'protect' -> Verifies JWT signatures & headers   │
          │  2. 'validateBody' -> Zod schemas guard data shapes  │
          │ *Cuts execution & sends 401||400 if validation fails.*
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        LAYER 2: THE CONTROLLER                         │
│                  (Files: backend/controllers/*)                        │
├────────────────────────────────────────────────────────────────────────┤
│  • Purely orchestrates HTTP request and response states (req, res).    │
│  • Extracts traffic inputs (req.params.id, req.body) cleanly.          │
│  • Forwards parsed data arguments straight down into the Service Layer.│
│  • ZERO boilerplate try/catch blocks due to express-async-errors.      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  LAYER 3: THE SERVICE LAYER (THE BRAIN)                │
│                    (Files: backend/services/*)                         │
├────────────────────────────────────────────────────────────────────────┤
│  • Encapsulates 100% of FlipQuiz's core business logic processing.     │
│  • Completely decoupled from Express context (no 'req' or 'res').      │
│  • Evaluates business authorization rules (e.g., creator ownership).   │
│  • Throws semantic errors that bubble straight up the call stack.      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      LAYER 4: MONGOOSE MODELS & DB                     │
│                     (Files: backend/models/*)                          │
├────────────────────────────────────────────────────────────────────────┤
│  •Enforces structural schemas and hooks directly at the database level.│
│  • Safeguards fields (e.g., select: false on hashes) against leaks.    │
│  • Performs raw MongoDB cluster queries via Mongoose ODM engines.      │
└────────────────────────────────────────────────────────────────────────┘

  ======================== THE ERROR INTERCEPTOR ======================== 
┌────────────────────────────────────────────────────────────────────────┐
│                GLOBAL EXCEPTION BOUNDARY (AOP PIPELINE)                │
│               (File: backend/middleware/errorMiddleware.js)            │
├────────────────────────────────────────────────────────────────────────┤
│  • Monitors the entire runtime call stack automatically.               │
│  • Catches Zod validation errors, JWT drops, and custom Service slips. │
│  • Intercepts bubbles globally, parsing them into standard client JSON.│
└────────────────────────────────────────────────────────────────────────┘

  ======================== QUALITY ASSURANCE =========================== 
┌────────────────────────────────────────────────────────────────────────┐
│                   THE ISOLATED TESTING INFRASTRUCTURE                  │
│                     (Files: backend/**/*.test.js)                      │
├────────────────────────────────────────────────────────────────────────┤
│  • Companion test blocks sit right next to production files.           │
│  • Uses Jest to completely mock external dependencies and models.      │
│  • Asserts layer functions in isolation for absolute determinism.      │
│  • Serves as an automated quality assurance gate for development.      │
└────────────────────────────────────────────────────────────────────────┘