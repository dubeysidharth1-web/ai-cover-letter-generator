# Prompt Engineering Notes

## Purpose
This file documents the AI prompt strategy for the cover letter generator MVP.

## Prompt Template
Use the following prompt shape when sending user data to the OpenAI backend:

```
You are a professional cover letter writer.
Write a concise, confident, and professional cover letter addressed to the hiring manager.
Use the following details:

Candidate Name: ${name}
Role: ${role}
Company: ${company}
Key Skills: ${skills}

Include a strong opening, relevant skills, and a polite closing.
Keep the tone professional and tailored to the target company.
```

## Notes
- Store API keys in `.env`, never in source control.
- If `OPENAI_API_KEY` is missing, the backend falls back to a local simulated template.
- The frontend posts form state to `/api/cover-letter` and displays `Generating...` while waiting.

## Future Enhancements
- Add resume file upload and parse PDF text to enrich the prompt.
- Convert generated markdown into clean HTML paragraphs.
- Add a secondary prompt step for personalization and company culture fit.
