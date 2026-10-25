import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://dawnlightlabs.com');
  const routes = ['/', '/research', '/projects', ...projects.map(p => '/projects/'+p.slug), '/about', '/contact'];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    routes.map(path => '<url><loc>'+new URL(path, origin).href+'</loc></url>').join('') +
    '</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
