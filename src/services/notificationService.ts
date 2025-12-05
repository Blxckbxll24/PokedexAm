import type { NotificationOptions } from '../types/pokemon';

export class NotificationService {
  private static instance: NotificationService;
  private hasPermission = false;

  constructor() {
    this.checkPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.hasPermission = Notification.permission === 'granted';
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones de escritorio');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.hasPermission) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Permisos de notificación denegados');
        return;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/pwa-192x192.png',
        tag: options.tag,
        badge: '/pwa-192x192.png'
      });

      // Auto-cerrar la notificación después de 4 segundos
      setTimeout(() => {
        notification.close();
      }, 4000);

    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
  }

  async notifyPokemonSelected(pokemonName: string): Promise<void> {
    const capitalizedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    
    await this.showNotification({
      title: 'Pokemon Seleccionado',
      body: `Has seleccionado a ${capitalizedName}`,
      tag: `pokemon-${pokemonName}`,
      icon: '/pwa-192x192.png'
    });
  }
}