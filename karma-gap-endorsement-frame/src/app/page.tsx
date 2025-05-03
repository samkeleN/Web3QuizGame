'use client';

import { useState } from 'react';
import { fetchProjectData } from './lib/fetchProjectData';
import type { KarmaProject } from './types';

export default function Home() {
  const [url, setUrl] = useState('');
  const [project, setProject] = useState<KarmaProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setProject(null);
    try {
      const data = await fetchProjectData(url);
      setProject(data);
    } catch (err) {
      setError('Could not fetch project data');
    }
  };

  return (
    <main className="container">
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Endorse a KarmaGAP Project
      </h1>
      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Curious about what someone built? Drop their KarmaGAP link here and show them some love!
      </p>
      <form className="fetch-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter KarmaGAP project link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Fetch</button>
      </form>

      {error && <p className="error">{error}</p>}

      {project && (
        <div className="project-card">
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      )}
    </main>
  );
}
