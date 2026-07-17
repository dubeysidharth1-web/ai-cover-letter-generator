import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/cover-letter', async (req, res) => {
  const { name, role, company, skills } = req.body || {};

  if (!name || !role || !company || !skills) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const fallback = `Dear Hiring Manager at ${company},\n\nMy name is ${name}, and I am excited to apply for the ${role} position at your organization. With strengths in ${skills}, I bring a combination of technical proficiency and communication skills that make me a strong fit for this role.\n\nI am confident that my experience will help ${company} deliver meaningful results and build a successful partnership. Thank you for considering my application.\n\nSincerely,\n${name}`;

  const prompt = `Write a concise, professional cover letter for ${name} applying for the ${role} role at ${company}. Mention these skills: ${skills}. Keep it ~250-350 words and sign with ${name}.`;

  if (!process.env.OPENAI_API_KEY) {
    return res.json({ letter: fallback, source: 'local' });
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 700
      })
    });

    const data = await resp.json();
    const letter = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || fallback;
    return res.json({ letter, source: 'openai' });
  } catch (err) {
    console.error('OpenAI request failed:', err);
    return res.json({ letter: fallback, source: 'local' });
  }
});

const port = Number(process.env.SERVER_PORT || 5179);
app.listen(port, () => {
  console.log(`Cover letter API listening on http://localhost:${port}`);
});
