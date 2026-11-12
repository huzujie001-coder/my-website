// Public endpoint only; provider credentials must never be VITE_* variables.
const base=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');
export const apiUrl=path=>base+path;
