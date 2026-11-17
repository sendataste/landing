// supabase-client.js
// Se carga DESPUÉS de supabase-js CDN y ANTES de script.js

const SUPABASE_URL = 'https://ydxaidynqnyjwpcjmnbb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_WAswrN7u9ky_lMkVYxE3Lw_ymDevhKj'; // pública, no pasa nada

window.sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);