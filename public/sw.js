// Service Worker for NEA Tracker
// This enables offline functionality and PWA features

const CACHE_NAME = "nea-tracker-v1"

// Clear any demo data that might be in localStorage
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Clear any demo data from localStorage
      if (typeof localStorage !== "undefined") {
        // Remove any demo data keys
        const keysToCheck = [
          "nea-tracker-demo-students",
          "nea-tracker-demo-scores",
          "nea-tracker-demo-data",
          "demo-students",
          "demo-scores",
          "demo-data",
        ]

        keysToCheck.forEach((key) => {
          try {
            localStorage.removeItem(key)
          } catch (e) {
            // Ignore errors
          }
        })
      }

      return cache.addAll(["/", "/index.html", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"])
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone())
              return fetchResponse
            })
          })
        )
      })
      .catch(() => {
        // Return offline page if available
        if (event.request.mode === "navigate") {
          return caches.match("/")
        }
        return new Response("Offline content not available")
      }),
  )
})

// Clear old caches when a new version is available
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
