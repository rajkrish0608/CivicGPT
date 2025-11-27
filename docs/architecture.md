# CivicGPT Architecture

## System Overview

CivicGPT is a multilingual government assistant designed to help citizens access schemes and services. It uses a microservices-like architecture orchestrated via Docker Compose.

### Components

1.  **Frontend (React + Vite)**
    -   **Port**: 3000
    -   **Tech**: React, TypeScript, i18next
    -   **Role**: User interface for Q&A, Autofill, and Case Management.
    -   **I18n**: Supports English, Hindi, and Punjabi.

2.  **Backend (Node.js + Express)**
    -   **Port**: 4000
    -   **Tech**: Express, TypeScript, TypeORM
    -   **Role**: API gateway, business logic, auth, and orchestration.
    -   **Modules**:
        -   `Auth`: JWT-based authentication.
        -   `QA`: Handles user queries via NLU and LLM.
        -   `Autofill`: Generates JSON form data from user input using LLM.
        -   `Cases`: Manages application lifecycle.
        -   `Worker`: Background job processing (PDF generation).

3.  **Database (PostgreSQL)**
    -   **Port**: 5432
    -   **Role**: Persistent storage for Users, Schemes, Cases, and Feedback.

4.  **Cache/Queue (Redis)**
    -   **Port**: 6379
    -   **Role**: Job queue for PDF generation (BullMQ).

### Data Flow

#### Q&A Flow
1.  User asks question (Frontend) -> `POST /api/qa/ask`
2.  Backend calls `NLUConnector` to identify intent.
3.  Backend calls `LLMAdapter` (OpenAI/Mock) to generate response.
4.  Response returned to Frontend.

#### Autofill Flow
1.  User selects scheme and enters data (Frontend) -> `POST /api/autofill`
2.  Backend fetches Scheme Template from DB.
3.  Backend calls `LLMAdapter` to map user data to template.
4.  Returns filled JSON to Frontend.
5.  User reviews and submits -> `POST /api/cases`
6.  Backend creates Case (Pending) and pushes job to Redis.
7.  Worker picks up job, generates PDF, updates Case (In Progress/Approved), and saves PDF path.

### Security & Privacy

-   **PII**: No real identity APIs are called. All flows are mocked.
-   **Consent**: Users must explicitly consent before data processing.
-   **Data Retention**: Configurable via env (not fully implemented in MVP).
-   **Encryption**: HTTPS recommended for production. DB encryption at rest recommended.

### Deployment

-   **Local**: `docker-compose up`
-   **Production**:
    -   Use managed Postgres/Redis.
    -   Set `NODE_ENV=production`.
    -   Secure `JWT_SECRET` and API keys.
    -   Enable SSL/TLS.
