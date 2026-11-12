import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/my-website/',plugins:[react()],define:{'import.meta.env.VITE_API_BASE_URL':JSON.stringify('https://rongcheng-pages-api.my-team-4125.chatgpt.site')}});
