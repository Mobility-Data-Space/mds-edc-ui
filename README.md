This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set up your GITHUB TOKEN:

- Create a personal access token on GitHub with the necessary permissions (repo, read:packages).
- Set the GITHUB_TOKEN environment variable:
    ```bash
    export GITHUB_TOKEN=your_github_token_here
    ```

### Setup Options

You have three options for setting up the project:

1. Local Setup (Connector only with locally run frontend)
2. Dev Setup (Build frontend Docker image and run in Docker Compose)
3. Demo Setup (Simulate 2 participants)

#### 1. Local Setup

This setup runs the connector only, with the frontend running locally.

Before you begin, make sure you have your **.envrc** file filled like the example provided in **.envrc.example**. You can find example values exported as **DATASPACE** from **src/constants/dataspace.ts**.

**package.json** has private repositories listed as dependencies and will require the presence of an **.npmrc** file. Follow the example in **.npmrc.example**.

1. Start the connector:
   ```bash
   docker compose -f docker-compose.connector.yml up -d
   ```

2. Run the frontend locally:
   ```bash
   yarn seed
   yarn dev
   ```

#### 2. Dev Setup

This setup builds the frontend Docker image and runs it with Docker Compose. Provide configuration as environment variables.

1. Set up your GITHUB TOKEN as described above.

2. Build and run the services:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

#### 3. Demo Setup

This setup simulates 2 participants. Provide configuration as environment variables.

1. Set up your GITHUB TOKEN as described above.

2. Build and run the services:
   ```bash
   docker-compose up -d
   ```

