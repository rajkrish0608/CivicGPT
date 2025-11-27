# CivicGPT

CivicGPT is an India-focused Local-Language Government Assistant. It helps citizens answer queries in multiple languages, autofill government forms, and track applications.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TypeScript
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **LLM**: Modular adapter (OpenAI/Mock)
- **Infrastructure**: Docker Compose

## Prerequisites

- **Docker & Docker Compose**:
    - **Mac**: Download and install [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/).
    - **Windows**: Download [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/).
    - **Linux**: Follow [official instructions](https://docs.docker.com/engine/install/).
    - *Note: Ensure Docker Desktop is running before starting the app.*
- Node.js 18+ (only for local dev without Docker)

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd CivicGPT
    ```

2.  **Environment Setup**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your API keys if needed (e.g., `OPENAI_API_KEY`).

3.  **Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:4000`

4.  **Manual Setup (Without Docker)**

    If you don't have Docker, you need local PostgreSQL and Redis instances running.

    **Backend:**
    1.  Update `.env` with your local DB and Redis credentials.
    2.  Install dependencies:
        ```bash
        cd backend
        npm install
        ```
    3.  Run migrations (ensure DB exists first):
        ```bash
        npm run typeorm migration:run -- -d src/data-source.ts
        ```
    4.  Start server:
        ```bash
        npm run dev
        ```

    **Frontend:**
    1.  Install dependencies:
        ```bash
        cd frontend
        npm install
        ```
    2.  Start dev server:
        ```bash
        npm run dev
        ```

## Demo Scenario (E2E)

1.  **Ask a Question**: Go to the "Ask" page, select "Hindi", and ask "How do I apply for a ration card?". The system will respond using the LLM adapter.
2.  **Autofill Form**: Navigate to "Form Autofill", select a scheme, and click "Autofill". The system will generate a PDF with sample data.
3.  **Create Case**: Submitting the form will create a case in the "My Cases" section.
4.  **Admin Review**: Go to "Admin" to view and update the status of the case.

## Project Structure

- `backend/`: Express API and workers
- `frontend/`: React UI
- `templates/`: Scheme templates and PDF assets
- `docs/`: Architecture and design documentation

## License

MIT
