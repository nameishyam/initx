# initx

A lightning-fast CLI tool to scaffold a modern full-stack application with **React (Vite)** on the frontend and **Express** on the backend, pre-configured with a root orchestrator.

## Features

- **Frontend**: React + Vite (Fast Refresh enabled).
- **Backend**: Node.js + Express (CORS pre-configured).
- **Orchestration**: Run both frontend and backend simultaneously with a single command using `concurrently`.
- **Pre-built Status Check**: A built-in connection test to verify your API is talking to your UI immediately.

## Quick Start

You don't need to install anything globally. Just run:

```bash
npx create-initx my-app
```

and follow the steps there after.

Your frontend will be running on [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) and your backend on [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000).

## Project Structure

```text
my-app/
├── frontend/        # Vite + React
├── backend/         # Express Server
└── package.json     # Root orchestrator
```

#### Developed by Syam Gowtham

- **GitHub**: [github.com/nameishyam](https://github.com/nameishyam)
- **LinkedIn**: [linkedin.com/in/nameishyam](https://www.linkedin.com/in/nameishyam)
- **Website**: [portfolio-syam.vercel.app](https://portfolio-syam.vercel.app)

## License

MIT
