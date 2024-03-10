import { convertUint8ArrayToB64String } from "@/utils";
import { getApiResponse } from "@/utils/api";
import { defaultCache } from "@serwist/next/browser";
import { installSerwist } from "@serwist/sw";

import { api } from "@/lib/api";

import type { PrecacheEntry } from "@serwist/precaching";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your `injectionPoint`.
  // `injectionPoint` is an InjectManifest option.
  // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const { title, lang = "en", body, tag, timestamp, requireInteraction, actions, image } = event.data.json();

    const promiseChain = self.registration.showNotification(title, {
      lang,
      body,
      requireInteraction,
      tag: tag || undefined,
      timestamp: timestamp ? Date.parse(timestamp) : undefined,
      actions: actions || undefined,
      image: image || undefined,
      badge: "/favicon-32x32.png",
      icon: "/favicon-32x32.png"
    });

    // Ensure the toast notification is displayed before exiting this function
    event.waitUntil(promiseChain);
  }
});

// Handle click event for notifications
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the clicked notification

  // Ensure that a window is focused or open a new one
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];

        // Find the focused client if available
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }

        // Focus on the found client
        return client.focus();
      }

      // Open a new window if no clients are available
      return self.clients.openWindow("/");
    })
  );
});

self.addEventListener(
  "pushsubscriptionchange",
  (event) => {
    const oldSubscription = (event as ExtendableEvent & { oldSubscription: PushSubscription })?.oldSubscription;

    if (oldSubscription) {
      const subscription = self.registration.pushManager.subscribe(oldSubscription.options).then(async (subscription) => {
        await getApiResponse(
          api.post("/push/unsubscribe", {
            endpoint: oldSubscription.endpoint,
            p256dh: convertUint8ArrayToB64String(oldSubscription.getKey("p256dh")!),
            auth: convertUint8ArrayToB64String(oldSubscription.getKey("auth")!)
          })
        );

        await getApiResponse(
          api.post("/push/subscribe", {
            endpoint: subscription.endpoint,
            p256dh: convertUint8ArrayToB64String(subscription.getKey("p256dh")!),
            auth: convertUint8ArrayToB64String(subscription.getKey("auth")!)
          })
        );
      });
      (event as ExtendableEvent)?.waitUntil(subscription);
    }
  },
  false
);
