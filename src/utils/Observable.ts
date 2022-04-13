type Observer = () => any

export class Observable {
  private listeners: Set<Observer>

  constructor() {
    this.listeners = new Set()
  }

  listen(observer: Observer) {
    this.listeners.add(observer)
    return () => {
      this.listeners.delete(observer)
    }
  }

  subscribe(observer: Observer) {
    observer()
    return this.listen(observer)
  }

  notify() {
    this.listeners.forEach((observer) => {
      observer()
    })
  }
}
