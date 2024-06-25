// src/pubsub/PubSub.ts
export class PubSub {
    constructor() {
        this.subscribers = {};
    }
    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    }
    unsubscribe(event, callback) {
        if (!this.subscribers[event])
            return;
        this.subscribers[event] = this.subscribers[event].filter((subscriber) => subscriber !== callback);
    }
    publish(event, data) {
        if (!this.subscribers[event])
            return;
        this.subscribers[event].forEach((callback) => callback(data));
    }
}
export const pubSub = new PubSub();