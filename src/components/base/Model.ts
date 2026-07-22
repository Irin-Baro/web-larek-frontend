import { EventEmitter } from './events';

export abstract class Model<T> {
    protected events: EventEmitter;
    protected data: Partial<T> = {};

    constructor(data: Partial<T>, events: EventEmitter) {
        this.events = events;
        this.data = data;
        Object.assign(this, data);
    }

    emitChanges(event: string, payload?: any): void {
        this.events.emit(event, payload ?? this.data);
    }
}