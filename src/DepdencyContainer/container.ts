// di-container.ts
export class DIContainer {
  private static services: Map<string, any> = new Map();

  static register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  static resolve<T>(key: string): T {
    const instance = this.services.get(key);
    if (!instance) {
      throw new Error(`No provider found for ${key}`);
    }
    return instance;
  }
}
