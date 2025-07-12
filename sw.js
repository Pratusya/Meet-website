/*
 * GUJARAT PROFIL - SERVICE WORKER
 * Progressive Web App (PWA) Capabilities
 */

const CACHE_NAME = "gujarat-profil-v1.0.0";
const STATIC_CACHE = "gujarat-profil-static-v1";
const DYNAMIC_CACHE = "gujarat-profil-dynamic-v1";

// Files to cache for offline functionality
const STATIC_FILES = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/logo.jpg",
  "/logo.png",
  "/CNC.jpg",
  "/about us.jpg",
  "/design.jpg",
  "/industrial-facility.jpg",
  "/industrai.jpg",
  // Add other important assets
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static files", error);
      })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Service Worker: Deleting old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all pages
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", event.request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone response for caching
          const responseToCache = response.clone();

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("Service Worker: Fetch failed", error);

          // Return offline page for navigation requests
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }

          // Return offline image for image requests
          if (event.request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="14" fill="#999">Image Offline</text></svg>',
              {
                headers: { "Content-Type": "image/svg+xml" },
              }
            );
          }
        });
    })
  );
});

// Background sync (if supported)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Background sync triggered");
    // Handle background sync tasks
  }
});

// Push notifications (if supported)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log("Service Worker: Push notification received", data);

    const options = {
      body: data.body || "New notification from Gujarat Profil",
      icon: "/logo.png",
      badge: "/logo.png",
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: "view",
          title: "View",
          icon: "/logo.png",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "Gujarat Profil",
        options
      )
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      case "GET_VERSION":
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case "CLEAR_CACHE":
        caches
          .keys()
          .then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => caches.delete(cacheName))
            );
          })
          .then(() => {
            event.ports[0].postMessage({ success: true });
          });
        break;
    }
  }
});

console.log("Service Worker: Script loaded successfully");
