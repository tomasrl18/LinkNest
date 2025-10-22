import path from 'node:path';
import { createHash } from 'node:crypto';

const VIRTUAL_MODULE_ID = 'virtual:pwa-register';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

const STATIC_DESTINATIONS = ['style', 'script', 'worker'];

function parseExtensions(patterns = []) {
  const result = new Set();
  const list = Array.isArray(patterns) ? patterns : [patterns];
  for (const pattern of list) {
    if (typeof pattern !== 'string') continue;
    const match = pattern.match(/\{([^}]+)\}/);
    if (match) {
      match[1]
        .split(',')
        .map((entry) => entry.trim().replace(/^\./, ''))
        .filter(Boolean)
        .forEach((ext) => result.add(ext));
      continue;
    }
    const ext = path.extname(pattern).replace('.', '');
    if (ext) {
      result.add(ext);
    }
  }
  return result;
}

function normalizeBase(base) {
  if (!base || base === './') return '/';
  return base.endsWith('/') ? base : `${base}/`;
}

function joinUrl(base, file) {
  if (file.startsWith('/')) return file;
  if (base === '/') return `/${file}`;
  return `${base}${file}`;
}

function buildRegisterModule(base, registerType) {
  const swUrl = `${base}sw.js`;
  const immediate = registerType === 'autoUpdate';
  return `export function registerSW(options = {}) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return async () => {};
  }
  const {
    immediate = ${immediate ? 'true' : 'false'},
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError
  } = options;
  let registration;
  const register = async () => {
    try {
      registration = await navigator.serviceWorker.register('${swUrl}');
      onRegistered?.(registration);
      if (${immediate ? 'true' : 'false'}) {
        registration?.update?.();
      }
      if (registration?.waiting && navigator.serviceWorker.controller) {
        onNeedRefresh?.();
      }
      registration?.addEventListener?.('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              onNeedRefresh?.();
            } else {
              onOfflineReady?.();
            }
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed', error);
      onRegisterError?.(error);
    }
  };
  if (immediate) {
    void register();
  } else {
    window.addEventListener('load', () => void register(), { once: true });
  }
  return async () => {
    if (registration) {
      await registration.update();
    }
  };
}
`;
}

function collectPrecacheAssets(bundle, globPatterns, includeAssets = []) {
  const extensions = parseExtensions(globPatterns);
  const precache = new Set();
  for (const [fileName, output] of Object.entries(bundle)) {
    if (!fileName) continue;
    if (output.type === 'chunk') {
      precache.add(fileName);
      continue;
    }
    const ext = path.extname(fileName).replace('.', '').toLowerCase();
    if (!extensions.size || extensions.has(ext)) {
      precache.add(fileName);
    }
  }
  for (const asset of includeAssets) {
    if (typeof asset !== 'string') continue;
    const normalized = asset.startsWith('/') ? asset.slice(1) : asset;
    precache.add(normalized);
  }
  precache.add('index.html');
  precache.add('offline.html');
  precache.add('manifest.webmanifest');
  return Array.from(precache);
}

function createServiceWorkerSource({ precacheUrls, base, versionHash, offlineUrl }) {
  const precacheArray = JSON.stringify(precacheUrls);
  return `const PRECACHE = 'linknest-precache-${versionHash}';
const RUNTIME = 'linknest-runtime-${versionHash}';
const STATIC_CACHE = 'linknest-static-${versionHash}';
const IMAGE_CACHE = 'linknest-images-${versionHash}';
const API_CACHE = 'linknest-api-${versionHash}';
const SUPABASE_CACHE = 'linknest-supabase-${versionHash}';
const OFFLINE_URL = '${offlineUrl}';
const PRECACHE_URLS = ${precacheArray};
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => ![PRECACHE, RUNTIME, STATIC_CACHE, IMAGE_CACHE, API_CACHE, SUPABASE_CACHE].includes(key))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      if (response && response.status === 200) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);
  if (cached) {
    void networkPromise;
    return cached;
  }
  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }
  return caches.match(request);
}
async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    if (fallbackUrl) {
      const precache = await caches.open(PRECACHE);
      const offlineResponse = await precache.match(fallbackUrl);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }
  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, RUNTIME, OFFLINE_URL));
    return;
  }
  if (${JSON.stringify(STATIC_DESTINATIONS)}.includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }
  if (url.origin === self.location.origin && url.pathname.startsWith('${base}api/') && request.method === 'GET') {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }
  if (url.hostname.endsWith('supabase.co') && url.pathname.includes('/rest/v1/') && request.method === 'GET') {
    event.respondWith(networkFirst(request, SUPABASE_CACHE));
    return;
  }
});
`;
}

export function VitePWA(userOptions = {}) {
  const options = {
    registerType: 'prompt',
    includeAssets: [],
    manifest: {},
    workbox: {},
    ...userOptions,
  };
  let base = '/';
  return {
    name: 'vite-plugin-pwa-lite',
    enforce: 'post',
    configResolved(resolvedConfig) {
      base = normalizeBase(resolvedConfig.base);
    },
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
      return null;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return buildRegisterModule(base, options.registerType);
      }
      return null;
    },
    generateBundle(_, bundle) {
      const precacheAssets = collectPrecacheAssets(
        bundle,
        options.workbox?.globPatterns,
        options.includeAssets,
      );
      const precacheUrls = Array.from(new Set(precacheAssets.map((asset) => joinUrl(base, asset))));
      const rootUrl = base === '/' ? '/' : base;
      if (!precacheUrls.includes(rootUrl)) {
        precacheUrls.unshift(rootUrl);
      }
      const offlineUrl = joinUrl(base, 'offline.html');
      if (!precacheUrls.includes(offlineUrl)) {
        precacheUrls.push(offlineUrl);
      }
      if (!precacheUrls.includes(joinUrl(base, 'manifest.webmanifest'))) {
        precacheUrls.push(joinUrl(base, 'manifest.webmanifest'));
      }
      const versionHash = createHash('sha256')
        .update(precacheUrls.join('|'))
        .digest('hex')
        .slice(0, 12);
      const manifestSource = JSON.stringify(options.manifest, null, 2);
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: manifestSource,
      });
      const swSource = createServiceWorkerSource({
        precacheUrls,
        base,
        versionHash,
        offlineUrl,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: swSource,
      });
    },
  };
}

export default VitePWA;
