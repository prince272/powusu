import { Subject } from "rxjs";

export type EventData = {
  key: string;
  value?: any;
};

export class Events extends Subject<EventData> {
  constructor() {
    super();
  }

  subscribeTo(callback: (value: any) => void, keys: string[]) {
    const subscription = this.subscribe((event: EventData) => {
      if (keys.includes(event.key)) {
        callback(event.value);
      }
    });
    return subscription;
  }
}

const events = new Events();

export { events };
