# AI Cover Letter Generator

This project is a simple SaaS-style cover letter generator with a simulated AI backend.

## What it includes

- React + Vite frontend
- Form for Candidate Name, Role, Company, and Key Skills
- Simulated cover letter controller returning a personalized letter
- "Copy to Clipboard" button
- Express server stub for API route
- `.env` support with `.gitignore`

## Local development

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:4173`

## Environment

Create a `.env` file at the project root with:

```
OPENAI_API_KEY=your_api_key_here
SERVER_PORT=5178
```

The app already ignores `.env` in `.gitignore`, so your API key will not be committed.

### Behavior

- If `OPENAI_API_KEY` is set, the server will call OpenAI to generate the cover letter.
- If `OPENAI_API_KEY` is not set, the backend will safely fall back to a local simulated template.
