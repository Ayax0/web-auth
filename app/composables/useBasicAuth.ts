import type { GenericObject } from "vee-validate";
import { toast } from "vue-sonner";

export default async function (body: GenericObject) {
  await $fetch("/api/auth", {
    method: "POST",
    retry: false,
    onRequest({ options }) {
      options.headers = new Headers(options.headers);
      options.headers.append(
        "Authorization",
        `Basic ${toBase64(`${body.username}:${body.password}`)}`
      );
    },
    async onResponse({ response }) {
      if (!response.ok) return;

      await $fetch("/api/auth", {
        method: "PUT",
        onResponse({ response }) {
          if (!response.ok) return;
          navigateTo("/");
        },
        onResponseError() {
          toast.error("Authentifizierung fehlgeschlagen", {
            description:
              "Bitte wenden Sie sich an den Support, wenn das Problem weiterhin besteht.",
          });
        },
      });
    },
    onResponseError({ response }) {
      if (response.status === 403)
        toast.error("Login fehlgeschlagen", {
          description: "Ungültiger Benutzername oder Passwort",
        });
      else
        toast.error("Login fehlgeschlagen", {
          description: "Ungültiger Vorgang. Bitte versuchen Sie es erneut.",
        });
    },
  });
}
