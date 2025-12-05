import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock para Notification API
Object.defineProperty(globalThis, 'Notification', {
  value: class MockNotification {
    static readonly permission = 'granted'
    static readonly requestPermission = vi.fn().mockResolvedValue('granted')
    
    constructor(title: string, options?: NotificationOptions) {
      this.title = title
      this.body = options?.body || ''
      this.icon = options?.icon || ''
    }
    
    close = vi.fn()
    
    title: string
    body: string
    icon: string
  },
  writable: true
})

// Mock para el service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn().mockResolvedValue({
      installing: null,
      waiting: null,
      active: null,
    }),
  },
  writable: true
})