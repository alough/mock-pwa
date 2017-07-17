var cacheName = 'mockPWA-v1';
var filesToCache = [
	'./',
	'./index.html',
  './manifest.json',
  './static/js/bundle.js'
];

self.addEventListener('install', function(e) {
	console.log('[demoPWA - ServiceWorker] Install event fired.');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[demoPWA - ServiceWorker] Caching app shell...');
			return cache.addAll(filesToCache).then(function() {
				self.skipWaiting();
			});
		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('[demoPWA - ServiceWorker] Activate event fired.');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					console.log('[demoPWA - ServiceWorker] Removing old cache...', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	console.log('[demoPWA - ServiceWorker] Fetch event fired.', e.request.url);
	e.respondWith(
		caches.match(e.request).then(function(response) {
			return response || fetch(e.request).then(function (resp){
        return caches.open(cacheName).then(function(cache){
        	console.log('[demoPWA - ServiceWorker] Fetched from URL');
          cache.put(e.request, resp.clone());
          return resp;
        })
      })
		})
	);
});
