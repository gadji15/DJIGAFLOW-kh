/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "djigaflow-cache-v1"

// Assets to cache on install
const PRECACHE_ASSETS = ["/", "/manifest.json", "/icons/favicon.ico", "/icons/apple-touch-icon.png", "/placeholder.svg"]

// Install event - precache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }),
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          }),
      )
    }),
  )
  // Take control of all clients as soon as it activates
  self.clients.claim()
})

// Fetch event - network first with cache fallback for images and static assets
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // For HTML pages - network first with cache fallback
  if (event.request.headers.get("Accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/")
          })
        }),
    )
    return
  }

  // For images and static assets - cache first with network fallback
  if (
    event.request.destination === "image" ||
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "font"
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Fetch in the background to update cache
          fetch(event.request)
            .then((response) => {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone())
              })
            })
            .catch(() => {
              // Silently fail if update fails
            })
          return cachedResponse
        }

        // Otherwise fetch from network and cache
        return fetch(event.request)
          .then((response) => {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
            return response
          })
          .catch(() => {
            // For images, return a placeholder if both cache and network fail
            if (event.request.destination === "image") {
              return caches.match("/placeholder.svg")
            }
            return new Response("Resource not available", { status: 404 })
          })
      }),
    )
    return
  }

  // For API requests - network only
  if (event.request.url.includes("/api/")) {
    return
  }

  // For everything else - network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone)
        })
        return response
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response("Resource not available", { status: 404 })
        })
      }),
  )
})

// Push event - handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "DjigaFlow"
  const options = {
    body: data.body || "Nouvelle notification",
    icon: data.icon || "/icons/apple-touch-icon.png",
    badge: data.badge || "/icons/badge-icon.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click event - open the URL when notification is clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const url = event.notification.data?.url || "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }
      // Otherwise, open a new window
      return self.clients.openWindow(url)
    }),
  )
})

export {}
