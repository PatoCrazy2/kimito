self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const title = data.title || "Kimito — Aseo del hogar";
    const options = {
      body: data.body || "Tienes una nueva actualización de tareas",
      icon: data.icon || "/favicon.ico",
      data: { url: data.url || "/dashboard" },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
