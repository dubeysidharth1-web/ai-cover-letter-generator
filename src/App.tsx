import { useMemo, useState } from 'react';

interface FormState {
  name: string;
  role: string;
  company: string;
  skills: string;
}

const defaultState: FormState = {
  name: '',
  role: '',
  company: '',
  skills: ''
};

function simulateCoverLetter({ name, role, company, skills }: FormState) {
  if (!name || !role || !company || !skills) {
    return 'Fill in all fields to generate a personalized cover letter preview.';
  }

  return `Dear Hiring Manager at ${company},

My name is ${name}, and I am excited to apply for the ${role} position at your organization. With strengths in ${skills}, I bring a combination of technical proficiency and communication skills that make me a strong fit for this role.

I am confident that my experience will help ${company} deliver meaningful results and build a successful partnership. Thank you for considering my application.

Sincerely,
${name}`;
}

function App() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [generated, setGenerated] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const preview = useMemo(() => simulateCoverLetter(form), [form]);

  const onChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGenerating(true);
    setCopyStatus('');

    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        setGenerated(preview);
        setCopyStatus(data.error || 'Unable to generate cover letter.');
      } else {
        setGenerated(data.letter);
        setCopyStatus(data.source === 'openai' ? 'Generated with OpenAI' : 'Generated locally (simulation)');
      }
    } catch (error) {
      setGenerated(preview);
      setCopyStatus('Unable to connect to the API. Showing preview only.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated || preview);
      setCopyStatus('Copied to clipboard!');
    } catch (error) {
      setCopyStatus('Copy failed. Please try again.');
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>AI Cover Letter Generator</h1>
        <p>Simulated cover letter preview powered by your job details and skills.</p>
      </header>

      <main>
        <div className="layout">
          <form className="cover-form panel" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Candidate Name</label>
              <input id="name" aria-required="true" value={form.name} onChange={onChange('name')} placeholder="Jane Doe" />
            </div>

            <div className="form-row">
              <label htmlFor="role">Role</label>
              <input id="role" aria-required="true" value={form.role} onChange={onChange('role')} placeholder="Product Manager" />
            </div>

            <div className="form-row">
              <label htmlFor="company">Company</label>
              <input id="company" aria-required="true" value={form.company} onChange={onChange('company')} placeholder="Acme Corp" />
            </div>

            <div className="form-row">
              <label htmlFor="skills">Key Skills</label>
              <textarea id="skills" aria-required="true" value={form.skills} onChange={onChange('skills')} placeholder="Leadership, data analysis, stakeholder management" rows={4} />
            </div>

            <div className="action-row">
              <button type="submit" disabled={isGenerating}>
                {isGenerating ? 'Generating…' : 'Generate Cover Letter'}
              </button>
            </div>
          </form>

          <section className="output-card panel">
            <div className="output-header">
              <h2>Generated Cover Letter</h2>
              <button onClick={handleCopy} disabled={isGenerating || !preview}>
                Copy to Clipboard
              </button>
            </div>

            <div className="letter-block">
              <pre>{generated || preview}</pre>
            </div>

            {copyStatus && (
              <div className="copy-status" role="status" aria-live="polite">
                {copyStatus}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
