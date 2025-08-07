type EventName = string;
type Subscriber<T = any> = (data: T) => void;

export class EventEmitter {
  private _events: Map<EventName, Set<Subscriber>>;
  private _allSubscribers: Set<Subscriber>;

  constructor() {
    this._events = new Map();
    this._allSubscribers = new Set();
  }


  on<T = any>(event: EventName, callback: Subscriber<T>): void {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    this._events.get(event)!.add(callback);
  }

  off<T = any>(event: EventName, callback: Subscriber<T>): void {
    this._events.get(event)?.delete(callback);
  }

  emitEvent<T = any>(event: EventName, data: T): void {
    this._events.get(event)?.forEach((callback) => callback(data));
    this._allSubscribers.forEach((callback) =>
      callback({ event, data })
    );
  }

  onAll(callback: Subscriber<{ event: string; data: any }>): void {
    this._allSubscribers.add(callback);
  }

  offAll(callback: Subscriber<{ event: string; data: any }>): void {
    this._allSubscribers.delete(callback);
  }

  trigger<T = any>(event: EventName): (data: T) => void {
    return (data: T) => this.emitEvent(event, data);
  }
}
