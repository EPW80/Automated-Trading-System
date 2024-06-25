/**
 * PubSub class to handle publish-subscribe pattern.
 */
export class PubSub {
    constructor() {
        // An object to store subscribers, with event names as keys and arrays of callback functions as values.
        this.subscribers = {};
    }
    /**
     * Subscribe to an event with a callback function.
     * @param event - The name of the event to subscribe to.
     * @param callback - The callback function to be called when the event is published.
     */
    subscribe(event, callback) {
        // If there are no subscribers for the event, initialize the array.
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        // Add the callback function to the subscribers array for the event.
        this.subscribers[event].push(callback);
    }
    /**
     * Unsubscribe from an event.
     * @param event - The name of the event to unsubscribe from.
     * @param callback - The callback function to be removed from the subscribers array.
     */
    unsubscribe(event, callback) {
        // If there are no subscribers for the event, return early.
        if (!this.subscribers[event])
            return;
        // Filter out the callback function from the subscribers array for the event.
        this.subscribers[event] = this.subscribers[event].filter((subscriber) => subscriber !== callback);
    }
    /**
     * Publish an event, calling all subscribed callback functions with the provided data.
     * @param event - The name of the event to publish.
     * @param data - The data to be passed to the callback functions.
     */
    publish(event, data) {
        // If there are no subscribers for the event, return early.
        if (!this.subscribers[event])
            return;
        // Call each callback function with the provided data.
        this.subscribers[event].forEach((callback) => callback(data));
    }
}
// Create a single instance of PubSub to be used throughout the application.
export const pubSub = new PubSub();
