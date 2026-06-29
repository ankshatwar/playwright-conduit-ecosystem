# Playwright TypeScript Conduit Automation Suite

> Test automation framework for the [Conduit RealWorld](https://demo.realworld.show) platform. Features UI, API, contract, and network-layer coverage in a single typed codebase.

[![Playwright](https://img.shields.io/badge/Playwright-v1.60-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v6.0%20Strict-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Zod](https://img.shields.io/badge/Zod-v4-3068b7)](https://zod.dev)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions%20%2B%20Docker-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Docker-Containerised-2496ed?logo=docker&logoColor=white)](https://www.docker.com)

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ankshatwar/playwright-conduit-ecosystem.git
cd playwright-conduit-ecosystem

# 2. Install dependencies
npm ci

# 3. Install Playwright browser binaries
npx playwright install chromium

# 4. Initialise environment variables
cp .env.example .env

# 5. Execute test runner scripts
npm run test          # Run all tests headlessly
npm run test:headed   # Run tests with visible browser
npm run test:ui       # Open interactive Playwright UI mode
npm run test:report   # View last HTML execution report
```

---

## ⚙️ Configuration & Environments

The framework loads `.env` automatically via `dotenv` — no shell exports needed.

### Local Initialization
The repository contains a template file named `.env.example` that maps all required system variables. Copy this file to create your active `.env` file and populate it with your local credentials.


### Local `.env` Configuration

```dotenv
# Application URLs
BASE_URL=https://demo.realworld.show
API_URL=https://api.realworld.show/api

# Primary test user (article creation, E2E flows)
CONDUIT_EMAIL=playwright.testmail01@internal-ci.net
CONDUIT_PASSWORD='your_password_here'

# Secondary test user (cross-user favourite flow)
READER_EMAIL=playwright.testmail02@internal-ci.net
READER_PASSWORD='your_password_here'
```

> ⚠️ **Special Characters** — if a password contains `#`, wrap the value in single quotes to prevent the shell treating it as a comment:
> ```dotenv
> CONDUIT_PASSWORD='P@ssw0rd#2024'
> ```

### Environment Variable Reference

| Variable | Required | Purpose |
|:---|:---|:---|
| `BASE_URL` | Yes | Browser navigation base URL |
| `API_URL` | Yes | REST API base for seeding and auth |
| `CONDUIT_EMAIL` | Yes | Primary user — article CRUD flows |
| `CONDUIT_PASSWORD` | Yes | Primary user password |
| `READER_EMAIL` | Yes | Secondary user — cross-user favourite test |
| `READER_PASSWORD` | Yes | Secondary user password |

### CI/CD Secrets Management

In CI, secrets (`CONDUIT_PASSWORD`, `READER_PASSWORD`) are injected via **GitHub Secrets** and non-sensitive values (`BASE_URL`, `API_URL`) via **GitHub Variables** — never baked into the Docker image.

---

## 🏗️ Project Structure

The codebase isolates concerns strictly to prevent flaky execution states.

```
playwright-conduit-ecosystem/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI: Docker build → run → upload HTML report
├── src/
│   ├── config/
│   │   └── endpoints.ts            # Central API endpoint registries
│   ├── data/
│   │   └── articleData.ts          # Typed test data and factory payloads
│   ├── fixtures/
│   │   └── test-base.ts            # Custom Dependency Injection container
│   ├── network/
│   │   ├── handlers/
│   │   │   ├── base.handler.ts               # Shared route intercept/teardown logic
│   │   │   ├── contract-validator.handler.ts # Captures responses, validates payloads
│   │   │   └── feed-latency.handler.ts       # Injects server delays for edge cases
│   │   └── schemas/
│   │       └── article.schema.ts             # Zod runtime API validation schemas
│   ├── pages/
│   │   ├── base.page.ts            # Abstract base: safeClick, safeType, navigateTo
│   │   ├── auth.page.ts            # Login form interactions and error assertions
│   │   ├── article-view.page.ts    # Article page: comment, favourite, delete
│   │   ├── create-article.page.ts  # Editor form: fill, submit, validation errors
│   │   └── home.page.ts            # Feed: loading state, article preview locators
│   ├── setup/
│   │   └── global.setup.ts         # Pre-suite API login — persists JWT to .auth/
│   └── utils/
│       ├── api.util.ts             # Authenticated REST client for data seeding
│       └── response-match.util.ts  # Request filter: URL + method + status matching
├── tests/                          # Feature spec execution suites
├── Dockerfile                      # Hermetic test execution container
├── playwright.config.ts            # Projects, parallelism, timeouts, storage state
├── tsconfig.json                   # Strict compiler flags
└── package.json                    # Script shortcuts and dependency manifest
```

### Architectural responsibilities

- **`src/pages/`** — Locators are `private readonly`. No selector strings in test files. `BasePage` guards every action with `waitFor: 'visible'`.
- **`src/network/`** — Intercept logic, schemas, and validation isolated from test files. All handlers extend `BaseHandler`.
- **`src/fixtures/`** — Wires all page objects and handlers into Playwright's DI system. Each test gets fresh instances — no shared state.
- **`src/utils/`** — API client reads the saved JWT from `.auth/user.json`. Polymorphic request matching utilities filter by URL, method, and status code.

---

## 🧠 Key Testing Capabilities

### 1. API Contract Validation (Zod v4)
Intercepts in-flight server responses during UI navigation. Validates payloads against strict Zod schemas. Catches backend API drift before any UI assertion executes. Failures include a structured diff showing the exact field path that broke.

### 2. Network Latency Simulation
`FeedLatencyHandler` injects a configurable delay into the article feed endpoint. Tests verify that loading spinners appear and resolve correctly — deterministic behaviour, no real network slowdown needed.

### 3. Hybrid API Setup & Teardown
`beforeEach` seeds test state via authenticated REST API calls — no slow UI setup flows. Tests assert UI immediately. `afterEach` cleans up via API regardless of outcome. Each run generates a unique UUID slug — safe for parallel execution and retries.

### 4. Multi-Context Session Orchestration
The favourite-article suite constructs a second browser context with a separate JWT inline. Both users operate simultaneously in distinct sessions — no pre-stored auth file required for the secondary user.

---

## 🔄 CI/CD & Execution

### GitHub Actions Pipeline

Triggers on `push` and `pull_request` to `main`. Tests run **inside a Docker container** — not on the runner directly.

```
Checkout → docker build → docker run (CI=true) → upload HTML report
```

**Why Docker:**
- Browser binaries locked to the image tag — no version drift between runs.
- Environment is identical locally and in CI.
- No runner-level Node or browser install steps.

### Locally Simulating CI

```bash
docker build -t playwright-conduit-suite .

docker run --rm --ipc=host \
  -e CI=true \
  -e BASE_URL="https://demo.realworld.show" \
  -e API_URL="https://api.realworld.show/api" \
  -e CONDUIT_EMAIL="your_email" \
  -e CONDUIT_PASSWORD="your_password" \
  -e READER_EMAIL="your_reader_email" \
  -e READER_PASSWORD="your_reader_password" \
  playwright-conduit-suite
```

### Parallelism & Scalability

| Environment | Workers | Reason |
|:---|:---|:---|
| Local | Auto (CPU-based) | Maximum throughput on developer hardware |
| CI | 1 | Stable against shared public API rate limits |

- `fullyParallel: true` enabled globally.
- Test suites are stateless — ready for sharded CI execution with a config-only change.
- HTML report and trace artifacts retained for **30 days** on every run, including failures.