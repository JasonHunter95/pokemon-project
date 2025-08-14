export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export async function fetchTypes() {
  const res = await fetch(`${API_BASE}/pokemon/types`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchPokemon({ search = '', types = [], limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (types?.length) params.set('types', types.join(','));
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  const res = await fetch(`${API_BASE}/pokemon?${params.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
