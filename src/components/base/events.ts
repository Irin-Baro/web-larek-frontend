type EventName = string;
type Subscriber = (data: any) => void;

export class EventEmitter {
    private _events: Map<EventName, Set<Subscriber>> = new Map();

    on<T>(eventName: string, callback: (data: T) => void): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set());
        }
        this._events.get(eventName)!.add(callback as Subscriber);
    }

    emit<T>(eventName: string, data?: T): void {
        const subscribers = this._events.get(eventName);
        if (subscribers) {
            subscribers.forEach(callback => callback(data));
        }
    }

    off(eventName: string, callback: Subscriber): void {
        const subscribers = this._events.get(eventName);
        if (subscribers) {
            subscribers.delete(callback);
        }
    }

    trigger<T>(eventName: string, context?: Partial<T>): (data: T) => void {
        return (data: T) => {
            this.emit(eventName, { ...data, ...context });
        };
    }
}

