# FlipQuiz
Flip Quiz is a fullstack, interactive web application designed to turn learning into an engaging, gamified experience. Users can create, customize, and play dynamic flashcard based quizzes. The platform seamlessly bridges intuitive user experience design with a robust, cloud connected backend engine.

Key Features

    Interactive Quiz Engine: Engaging frontend interface featuring smooth card-flipping animations and responsive layouts for a seamless gaming experience across all device sizes.

    Dynamic Grade & Performance Analytics: Built-in calculation logic to provide instant statistics, track user scores, and manage quiz performance over time.

    Robust Cloud Database Tunnel: Fully integrated with MongoDB Atlas cloud clusters utilizing persistent replica-set configurations to securely store user profiles, quizzes, and score histories.

    Decoupled Architecture: Clean separation between the client-side presentation layer and the RESTful server-side application programming interface (API).
    Input Validation Guard: Front-gate request filtering powered by Zod schemas to intercept malformed data at the routing layer, protecting server resources and optimizing API performance.

    Centralized Error Management: A unified asynchronous exception-handling pipeline utilizing custom middleware to eliminate boilerplate try/catch blocks and ensure deterministic JSON error payloads.

Tech Stack
Frontend (Client Layer)

    Core Framework: JavaScript (ES6+)

    Styling & UI: Modern utility-first CSS framework for fluid, accessible, and fully responsive layouts.

Backend (Server Layer)

    Runtime Environment: Node.js (v18+)

    Backend Framework: Express.js

    Object Modeling (ODM): Mongoose

    Schema Validation: Zod (Data integrity enforcement)

Database & Dev Tools

    Cloud Database: MongoDB Atlas

    Environment Safety: Dotenv (Variable masking)

    Process Monitor: Nodemon

    API Testing client: Insomnia

