/* 外国株式 損益シミュレーター - Service Worker */
const CACHE = 'gaikabu-sim-v1';

// 同一オリジンの必須ファイル（インストール時にプリキャッシュ）
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon-180.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// GETはキャッシュ優先。無ければ取得してキャッシュに保存（CDNのthree.jsやフォントも
// 初回アクセス後はオフラインで使えるようになる）。
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        // 正常な応答（自オリジン or CORS）だけキャッシュ。opaqueも一応保存。
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        // オフラインでナビゲーション要求ならindexを返す
        req.mode === 'navigate' ? caches.match('./index.html') : Promise.reject('offline')
      );
    })
  );
});
