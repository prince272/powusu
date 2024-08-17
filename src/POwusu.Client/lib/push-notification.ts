import { convertUint8ArrayToB64String, convertUrlB64ToUint8Array } from "@/utils";
import { ApiResponse, getApiResponse } from "@/utils/api";

import { api } from "./api";

export class PushNotification {
  private vapidPublicKeyCache: string | null = null;
  private permissionIntervalId: NodeJS.Timeout | null = null;

  private get isSupported() {
    return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
  }

  private async requestPermission(): Promise<"granted" | "denied" | "default"> {
    return this.isSupported ? Notification.requestPermission() : "denied";
  }

  public get permission(): string {
    return this.isSupported ? Notification.permission : "denied";
  }

  private async fetchVapidPublicKey(): Promise<ApiResponse<string>> {
    if (this.vapidPublicKeyCache != null) {
      // If the cache is not empty, return the cached value
      return { data: this.vapidPublicKeyCache };
    }

    const response = await getApiResponse(api.get<string>("/push/vapid-public-key"));

    if (!response.error) {
      // Cache the fetched value if there's no error
      this.vapidPublicKeyCache = response.data!;
    }

    return response;
  }

  private async subscribeToServer(subscription: PushSubscription): Promise<ApiResponse<void>> {
    const response = await getApiResponse(
      api.post("/push/subscribe", {
        endpoint: subscription.endpoint,
        p256dh: convertUint8ArrayToB64String(subscription.getKey("p256dh")!),
        auth: convertUint8ArrayToB64String(subscription.getKey("auth")!)
      })
    );
    return response;
  }

  private async unsubscribeFromServer(subscription: PushSubscription): Promise<ApiResponse<void>> {
    const response = await getApiResponse(
      api.post("/push/unsubscribe", {
        endpoint: subscription.endpoint,
        p256dh: convertUint8ArrayToB64String(subscription.getKey("p256dh")!),
        auth: convertUint8ArrayToB64String(subscription.getKey("auth")!)
      })
    );
    return response;
  }

  public async subscribe(requestPermissionIfRequired: boolean = false): Promise<void> {
    clearInterval(this.permissionIntervalId!);

    if (!this.isSupported) {
      throw new PushNotificationError("Push notifications are not supported.", "NOTIFICATION_UNSUPPORTED");
    }

    if (requestPermissionIfRequired) {
      const permission = await this.requestPermission();
      if (permission !== "granted") {
        if (permission === "denied") {
          throw new PushNotificationError("Permission denied.", "PERMISSION_DENIED");
        }
        throw new PushNotificationError("Permission cancelled.", "PERMISSION_CANCELLED");
      }
    }

    const vapidPublicKeyResponse = await this.fetchVapidPublicKey();
    if (vapidPublicKeyResponse.error) {
      throw new PushNotificationError(`Failed to fetch VAPID public key. Error: ${vapidPublicKeyResponse.error.title}`, "VAPID_KEY_FETCH_FAILED");
    }

    const registration = await navigator.serviceWorker.ready;
    const vapidPublicKey = convertUrlB64ToUint8Array(vapidPublicKeyResponse.data!);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey
    });

    const subscriptionResponse = await this.subscribeToServer(subscription);
    if (subscriptionResponse.error) {
      throw new PushNotificationError(`Failed to send subscription to server. Error: ${subscriptionResponse.error.title}`, "SUBSCRIPTION_FAILED");
    }
  }

  public async unsubscribe(): Promise<void> {
    clearInterval(this.permissionIntervalId!);

    if (!this.isSupported) {
      throw new PushNotificationError("Service Worker is not supported.", "NOTIFICATION_UNSUPPORTED");
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      return;
    }

    await subscription.unsubscribe();
    await this.unsubscribeFromServer(subscription);
    // Clear the interval if it exists
    if (this.permissionIntervalId) {
      clearInterval(this.permissionIntervalId);
    }
  }

  public watch(interval: number = 1000): () => void {
    const checkPermission = async () => {
      if (this.permission === "granted") {
        try {
          await this.subscribe();
        } catch (error) {
          console.warn(error);
        }
      }
    };

    this.permissionIntervalId = setInterval(checkPermission, interval);

    return () => {
      if (this.permissionIntervalId) {
        clearInterval(this.permissionIntervalId);
      }
    };
  }
}

export type PushNotificationErrorReasons = "NOTIFICATION_UNSUPPORTED" | "PERMISSION_DENIED" | "PERMISSION_CANCELLED" | "VAPID_KEY_FETCH_FAILED" | "SUBSCRIPTION_FAILED";

export class PushNotificationError extends Error {
  constructor(
    message: string,
    public reason?: PushNotificationErrorReasons
  ) {
    super(message);
    this.name = "PushNotificationError";
  }
}

export const pushNotification = new PushNotification();
