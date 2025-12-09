import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const DEFAULT_PROJECT_IMAGE = 'https://placehold.co/600x400/111111/FFFFFF?text=Project';

export default function AdminDashboard({ onLogout }) {
  const [metrics, setMetrics] = useState({ totalViewers: 0, newViewers: 0, messages: [], projects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingProjectId, setSavingProjectId] = useState(null);
  const [uploadingImageId, setUploadingImageId] = useState(null);
  const [removingImageId, setRemovingImageId] = useState(null);
  const fileInputsRef = useRef({});
  const bucketName = 'project-images';

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [viewerRes, messageRes, projectRes] = await Promise.all([
      supabase.from('viewer_events').select('id, created_at'),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('sort_order', { ascending: true })
    ]);

    if (viewerRes.error || messageRes.error || projectRes.error) {
      setError(viewerRes.error?.message || messageRes.error?.message || projectRes.error?.message);
      setLoading(false);
      return;
    }

    const viewerRows = viewerRes.data || [];
    const newViewers = viewerRows.filter(v => v.created_at >= since).length;

    setMetrics({
      totalViewers: viewerRows.length,
      newViewers,
      messages: messageRes.data || [],
      projects: projectRes.data || []
    });
    setLoading(false);
    setError('');
  }

  const applyProjectPatch = (id, patch) => {
    setMetrics(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, ...patch } : p))
    }));
  };

  const handleProjectChange = (id, field, value) => {
    applyProjectPatch(id, { [field]: value });
  };

  async function handleProjectSave(project) {
    if (!supabase) return;
    setSavingProjectId(project.id || 'new');
    const techSource = Array.isArray(project.tech_stack)
      ? project.tech_stack.join(',')
      : (project.tech_stack || '');

    const payload = {
      title: project.title?.trim() || 'Untitled Project',
      description: project.description?.trim() || '',
      badge: project.badge?.trim() || null,
      image_url: project.image_url?.trim() || null,
      repo_url: project.repo_url?.trim() || null,
      live_url: project.live_url?.trim() || null,
      sort_order: Number(project.sort_order ?? 0),
      tech_stack: techSource
        ? techSource.split(',').map(v => v.trim()).filter(Boolean)
        : []
    };

    let response;
    if (project.id) {
      response = await supabase.from('projects').update(payload).eq('id', project.id).select('*').single();
    } else {
      response = await supabase.from('projects').insert(payload).select('*').single();
    }

    if (response.error) {
      setError(response.error.message);
    } else {
      await fetchData();
    }
    setSavingProjectId(null);
  }

  async function handleProjectDelete(id) {
    if (!supabase || !id) return;
    if (!confirm('Delete this project?')) return;
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      await fetchData();
    }
  }

  const handleAddProject = () => {
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    setMetrics(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: tempId,
          title: 'New Project',
          description: '',
          tech_stack: [],
          badge: '',
          image_url: DEFAULT_PROJECT_IMAGE,
          repo_url: '',
          live_url: '',
          sort_order: prev.projects.length + 1,
          _isNew: true
        }
      ]
    }));
  };

  async function handleImageSelect(project, file) {
    if (!file || !supabase) return;
    try {
      setUploadingImageId(project.id);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_') || 'upload.png';
      const filePath = `${project.id || 'temp'}/${Date.now()}-${sanitizedName}`;
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (uploadError) {
        setError(uploadError.message);
      } else {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        handleProjectChange(project.id, 'image_url', data?.publicUrl || '');
      }
    } catch (e) {
      setError(e.message || 'Failed to upload image');
    } finally {
      if (fileInputsRef.current[project.id]) {
        fileInputsRef.current[project.id].value = '';
      }
      setUploadingImageId(null);
    }

    async function handleRemoveImage(project) {
      if (!supabase) return;
      const previousUrl = project.image_url || '';
      applyProjectPatch(project.id, { image_url: '' });
      const path = extractProjectImagePath(previousUrl);
      try {
        setRemovingImageId(project.id);
        if (path) {
          await supabase.storage.from(bucketName).remove([path]);
        }
      } catch (e) {
        setError(e.message || 'Failed to remove image');
        applyProjectPatch(project.id, { image_url: previousUrl });
      } finally {
        if (fileInputsRef.current[project.id]) {
          fileInputsRef.current[project.id].value = '';
        }
        setRemovingImageId(null);
      }
    }
  }

  const messagesCount = metrics.messages.length;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5', fontFamily: 'Inter, sans-serif', padding: '2rem 1.5rem 4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.1rem' }}>Portfolio Admin</h1>
          <p style={{ color: '#8f8f8f', margin: '.35rem 0 0 0' }}>Manage analytics, messages, and showcased projects.</p>
        </div>
        <button onClick={onLogout} style={{ border: '1px solid #333', background: 'transparent', color: '#fff', borderRadius: '999px', padding: '.65rem 1.5rem', cursor: 'pointer' }}>Logout</button>
      </header>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      {loading && <p>Loading dashboard…</p>}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <MetricCard label="Total Viewers" value={metrics.totalViewers} />
        <MetricCard label="New (7 days)" value={metrics.newViewers} />
        <MetricCard label="Messages" value={messagesCount} />
        <MetricCard label="Projects" value={metrics.projects.length} />
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Recent Messages</h2>
        <div style={{ border: '1px solid #1f1f1f', borderRadius: '18px', overflow: 'hidden' }}>
          {metrics.messages.slice(0, 5).map(msg => (
            <article key={msg.id} style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #1f1f1f' }}>
              <header style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
                <strong>{msg.name}</strong>
                <span style={{ color: '#9ca3af', fontSize: '.8rem' }}>{new Date(msg.created_at).toLocaleString()}</span>
              </header>
              <p style={{ margin: '.35rem 0', fontSize: '.9rem', color: '#d1d5db' }}>{msg.subject || 'No subject'}</p>
              <p style={{ margin: 0, color: '#f5f5f5' }}>{msg.message}</p>
              <a href={`mailto:${msg.email}`} style={{ color: '#a5b4fc', fontSize: '.8rem' }}>{msg.email}</a>
            </article>
          ))}
          {messagesCount === 0 && <p style={{ padding: '1rem 1.2rem', margin: 0 }}>No messages yet.</p>}
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h2>Projects</h2>
          <button onClick={handleAddProject} style={{ background: '#22c55e', border: 'none', color: '#05190e', borderRadius: '999px', padding: '.55rem 1.2rem', cursor: 'pointer', fontWeight: 600 }}>Add Project</button>
        </div>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          {metrics.projects.map(project => {
            return (
              <div key={project.id} style={{ border: '1px solid #1f1f1f', borderRadius: '18px', padding: '1.25rem', background: '#0d0d0d' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <span>Title</span>
                    <input value={project.title || ''} onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <span>Badge</span>
                    <input value={project.badge || ''} onChange={(e) => handleProjectChange(project.id, 'badge', e.target.value)} style={inputStyle} />
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <span>Image URL</span>
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                      <input
                        value={project.image_url || ''}
                        onChange={(e) => handleProjectChange(project.id, 'image_url', e.target.value)}
                        style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
                      />
                      <input
                        ref={(el) => {
                          fileInputsRef.current[project.id] = el;
                        }}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageSelect(project, e.target.files?.[0] || null)}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputsRef.current[project.id]?.click()}
                        style={{
                          background: '#22c55e',
                          border: 'none',
                          color: '#05190e',
                          borderRadius: '999px',
                          padding: '.55rem 1rem',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                        disabled={uploadingImageId === project.id}
                      >
                        {uploadingImageId === project.id ? 'Uploading…' : 'Upload Image'}
                      </button>
                    </div>
                    <small style={{ color: '#9ca3af' }}>Paste a URL or upload to the Supabase bucket.</small>
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={`${project.title || 'Project'} preview`}
                        style={{ marginTop: '.5rem', borderRadius: '12px', maxWidth: '240px', width: '100%', border: '1px solid #1f1f1f' }}
                      />
                    )}
                  </div>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <span>Sort Order</span>
                    <input type="number" value={project.sort_order ?? 0} onChange={(e) => handleProjectChange(project.id, 'sort_order', e.target.value)} style={inputStyle} />
                  </label>
                </div>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginTop: '1rem' }}>
                  <span>Description</span>
                  <textarea value={project.description || ''} onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} rows={3} style={{ ...inputStyle, minHeight: '90px' }} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', marginTop: '1rem' }}>
                  <span>Tech Stack (comma separated)</span>
                  <input
                    value={Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : (project.tech_stack || '')}
                    onChange={(e) => handleProjectChange(project.id, 'tech_stack', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <span>Repo URL</span>
                    <input value={project.repo_url || ''} onChange={(e) => handleProjectChange(project.id, 'repo_url', e.target.value)} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                    <span>Live URL</span>
                    <input value={project.live_url || ''} onChange={(e) => handleProjectChange(project.id, 'live_url', e.target.value)} style={inputStyle} />
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.75rem', marginTop: '1.25rem' }}>
                  {project.id && !project._isNew && (
                    <button onClick={() => handleProjectDelete(project.id)} style={{ background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '999px', padding: '.45rem 1rem', cursor: 'pointer' }}>Delete</button>
                  )}
                  <button onClick={() => handleProjectSave({
                    ...project,
                    tech_stack: typeof project.tech_stack === 'string' ? project.tech_stack : (project.tech_stack || []).join(', ')
                  })} style={{ background: '#d6f26a', border: 'none', color: '#111', borderRadius: '999px', padding: '.55rem 1.4rem', fontWeight: 600, cursor: 'pointer' }} disabled={savingProjectId === project.id}>
                    {savingProjectId === project.id ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            );
          })}
          {metrics.projects.length === 0 && !loading && <p>No projects yet. Click "Add Project" to get started.</p>}
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  padding: '.65rem .75rem',
  borderRadius: '10px',
  border: '1px solid #1f1f1f',
  background: '#090909',
  color: '#fff'
};

function MetricCard({ label, value }) {
  return (
    <div style={{ border: '1px solid #1f1f1f', borderRadius: '16px', padding: '1.2rem 1.4rem', background: '#0d0d0d' }}>
      <p style={{ margin: 0, color: '#9ca3af', fontSize: '.85rem' }}>{label}</p>
      <strong style={{ fontSize: '1.8rem' }}>{value}</strong>
    </div>
  );
}

function extractProjectImagePath(url) {
  if (!url) return null;
  try {
    const marker = '/project-images/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    const tail = url.slice(idx + marker.length);
    const clean = tail.split('?')[0];
    return decodeURIComponent(clean);
  } catch (e) {
    return null;
  }
}
