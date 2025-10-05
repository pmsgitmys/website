const CACHE_NAME = 'phonemax-v1'
const urlsToCache = [
  '/',
  '/products',
  '/wishlist',
  '/orders',
  '/offline.html',
  // Add static assets
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Cache installation failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip API calls for offline handling
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Return response if successful
          if (response.ok) {
            return response
          }
          throw new Error('Network response was not ok')
        })
        .catch(() => {
          // Return offline response for API calls
          return new Response(
            JSON.stringify({
              error: 'Offline',
              message: 'You are currently offline. Please check your connection.'
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          )
        })
    )
    return
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Return response if successful
          if (response.ok) {
            return response
          }
          throw new Error('Network response was not ok')
        })
        .catch(() => {
          // Return cached page or offline page
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return offline page for navigation
              return caches.match('/offline.html')
            })
        })
    )
    return
  }

  // Handle other requests (images, CSS, JS, etc.)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse
        }

        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return a fallback for images
            if (event.request.destination === 'image') {
              return new Response(
                '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">Image unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              )
            }
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    // For example, sync pending orders, wishlist changes, etc.
    console.log('Background sync triggered')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body || 'New notification from PhoneMax',
      icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=192',
      badge: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=96',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=96'
        },
        {
          action: 'close',
          title: 'Close',
          icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=96'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'PhoneMax', options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    const url = event.notification.data.url || '/'
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})