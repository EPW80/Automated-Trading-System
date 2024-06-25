// src/pubsub/PubSub.ts
export class PubSub {
    private subscribers: { [event: string]: Function[] } = {};
  
    subscribe(event: string, callback: Function) {
      if (!this.subscribers[event]) {
        this.subscribers[event] = [];
      }
      this.subscribers[event].push(callback);
    }
  
    unsubscribe(event: string, callback: Function) {
      if (!this.subscribers[event]) return;
  
      this.subscribers[event] = this.subscribers[event].filter(
        (subscriber) => subscriber !== callback
      );
    }
  
    publish(event: string, data: any) {
      if (!this.subscribers[event]) return;
      this.subscribers[event].forEach((callback) => callback(data));
    }
  }
  
  export const pubSub = new PubSub();
  