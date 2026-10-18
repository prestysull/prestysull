import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
if (existsSync('.env')) process.loadEnvFile('.env');
const site = process.env.SITE_URL || 'https://prestysull-sullana.majorelf.chatgpt.site';
export default defineConfig({ site, base: process.env.BASE_PATH || '/', output: 'static', trailingSlash: 'always' });
