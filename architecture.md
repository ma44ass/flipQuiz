┌────────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: THE ROUTER GATE                        │
│             (File: backend/routes/quizRoutes.js)                       │
├────────────────────────────────────────────────────────────────────────┤
│  • Listens for HTTP methods (GET, POST, PUT, DELETE)                   │
│  • Uses 'protect' middleware to check the user's JWT Bearer token      │
│  • Uses 'validate(quizSchema)' to let Zod check data formats           │
│  • Maps the endpoint (e.g., GET /:id) straight to the Controller       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      LAYER 2: THE CONTROLLER                           │
│             (File: backend/controllers/quizController.js)              │
├────────────────────────────────────────────────────────────────────────┤
│  • Purely handles HTTP inputs and outputs (req, res)                   │
│  • Extracts URL params (req.params.id) and body data                   │
│  • Passes variables down into the Service Layer Wall                   │
│  • ONLY handles the 200 OK or 201 Created success responses            │
│  • Has NO try/catch blocks because 'express-async-errors' hooks here   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                LAYER 3: THE SERVICE LAYER (THE WALL)                   │
│             (File: backend/services/quizService.js)                    │
├────────────────────────────────────────────────────────────────────────┤
│  • The brain! Contains 100% of FlipQuiz's core business logic          │
│  • Independent of Express (doesn't know what 'req' or 'res' means)     │
│  • Runs authorization rules (Checks if quiz.creator === userId)        │
│  • Inspects database outcomes. If data is missing/null:                │
│    ──► Instantly stamps 'error.statusCode = 404'                       │
│    ──► Triggers 'throw error;' to snap the pipeline shut               │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    LAYER 4: MONGOOSE MODELS & DB                       │
│             (File: backend/models/Quiz.js)                             │
├────────────────────────────────────────────────────────────────────────┤
│  • Enforces the strict data schema at the MongoDB database level       │
│  • Performs the raw queries (find, findById, findByIdAndUpdate)        │
│  • Connects directly to your live MongoDB Atlas cluster                │
└────────────────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────────────────┐
│                    THE TESTING LOOP (Jest & Watch Mode)                │
│             (File: backend/services/quizService.test.js)               │
├────────────────────────────────────────────────────────────────────────┤
│  • Runs locally in terminal via '--watchAll'                           │
│  • Uses 'jest.mock("../models/Quiz")' to create a fake database wall   │
│  • Tests Layer 3 (Service Layer) completely in isolation               │
│  • Simulates Mongoose returning valid mock data ──► Expects Green      │
│  • Simulates Mongoose returning null ─────────────► Expects 404 Throw  │
└────────────────────────────────────────────────────────────────────────┘