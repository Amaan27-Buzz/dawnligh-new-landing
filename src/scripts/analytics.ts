import { inject, type BeforeSendEvent } from '@vercel/analytics';

export function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  url.search = '';
  url.hash = '';
  return { ...event, url: url.href };
}

if (document.body.dataset.analytics === 'true' && navigator.doNotTrack !== '1') {
  inject({ framework: 'astro', mode: 'production', debug: false, beforeSend: sanitizeAnalyticsEvent });
}
